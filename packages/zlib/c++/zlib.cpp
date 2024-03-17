#include <node.h>
#include <zlib.h>
#include <node_buffer.h>
#include <node_object_wrap.h>

namespace zlib {
std::vector<bool> ValidateArgs(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    std::vector<bool> validArgs(args.Length(), false);
    for (std::size_t i = 0; i < args.Length(); ++i) {
        if (!args[i]->IsUndefined()) {
            validArgs[i] = true;
        }
    }
    return validArgs;
}

void inflateSyncBuffer(v8::Isolate* isolate, int flush, std::size_t windowBits,
    std::size_t chunkSize, std::size_t inputLength, char* input, v8::Local<v8::Object>& result)
{
    z_stream strm;
    std::memset(&strm, 0, sizeof(z_stream));
    int ret = inflateInit2(&strm, windowBits + 32);
    if (ret != Z_OK) {
        isolate->ThrowException(v8::Exception::Error(
            v8::String::NewFromUtf8Literal(isolate, "Failed to initialize zlib stream")));
        return;
    }

    uLong destLen = chunkSize;
    char* dest = new char[destLen];

    v8::Local<v8::Object> outputBuffer = node::Buffer::New(isolate, chunkSize).ToLocalChecked();
    char* output = node::Buffer::Data(outputBuffer);
    size_t outputLength = 0;

    strm.avail_in = static_cast<uInt>(inputLength);
    strm.next_in = (Bytef*)input;

    while (true) {
        strm.avail_out = static_cast<uInt>(destLen);
        strm.next_out = (Bytef*)dest;

        ret = inflate(&strm, flush);

        if (ret != Z_OK && ret != Z_STREAM_END) {
            inflateEnd(&strm);
            delete[] dest;
            isolate->ThrowException(v8::Exception::Error(
                v8::String::NewFromUtf8Literal(isolate, "Failed to inflate buffer")));
            return;
        }

        if (outputLength > chunkSize) {
            // Insufficient chunk size, retry...
            return inflateSyncBuffer(
                isolate, flush, windowBits, chunkSize * 2, inputLength, input, result);
        }

        outputLength += (chunkSize - strm.avail_out);
        std::memcpy(
            output + outputLength - (chunkSize - strm.avail_out), dest, chunkSize - strm.avail_out);

        if (strm.avail_out == 0) {
            outputLength += chunkSize;
            v8::Local<v8::Object> newOutputBuffer
                = node::Buffer::New(isolate, outputLength + chunkSize).ToLocalChecked();
            std::memcpy(node::Buffer::Data(newOutputBuffer), output, outputLength - chunkSize);
            outputBuffer = newOutputBuffer;
            output = node::Buffer::Data(outputBuffer) + outputLength - chunkSize;
            destLen += chunkSize;
            char* newDest = new char[destLen];
            std::memcpy(newDest, dest, chunkSize);
            delete[] dest;
            dest = newDest;
        }
        else {
            break;
        }
    }

    if (ret == Z_STREAM_END) {
        ret = inflateEnd(&strm);
        if (ret != Z_OK) {
            delete[] dest;
            isolate->ThrowException(v8::Exception::Error(
                v8::String::NewFromUtf8Literal(isolate, "Failed to end inflate stream")));
            return;
        }
    }

    v8::Local<v8::Object> newOutputBuffer
        = node::Buffer::New(isolate, outputLength).ToLocalChecked();
    std::memcpy(node::Buffer::Data(newOutputBuffer), output, outputLength);
    delete[] dest;

    result = newOutputBuffer;
}

void deflateSyncBuffer(v8::Isolate* isolate, int flush, std::size_t windowBits, std::size_t level,
    std::size_t memoryLevel, std::size_t strategy, std::size_t inputLength, char* input,
    v8::Local<v8::Object>& result)
{
    z_stream strm;
    std::memset(&strm, 0, sizeof(z_stream));
    int ret = deflateInit2(&strm, level, Z_DEFLATED, windowBits + 16, memoryLevel, strategy);

    if (ret != Z_OK) {
        isolate->ThrowException(v8::Exception::Error(
            v8::String::NewFromUtf8Literal(isolate, "Failed to initialize zlib stream")));
        return;
    }

    uLong destLen = compressBound(inputLength);
    char* dest = new char[destLen];

    strm.avail_in = static_cast<uInt>(inputLength);
    strm.next_in = (Bytef*)input;

    strm.avail_out = static_cast<uInt>(destLen);
    strm.next_out = (Bytef*)dest;

    ret = deflate(&strm, flush);

    if (ret != Z_OK && ret != Z_STREAM_END) {
        deflateEnd(&strm);
        delete[] dest;
        isolate->ThrowException(v8::Exception::Error(
            v8::String::NewFromUtf8Literal(isolate, "Failed to deflate buffer")));
        return;
    }

    size_t outputLength = destLen - strm.avail_out;
    v8::Local<v8::Object> outputBuffer = node::Buffer::New(isolate, outputLength).ToLocalChecked();
    std::memcpy(node::Buffer::Data(outputBuffer), dest, outputLength);

    deflateEnd(&strm);
    delete[] dest;

    result = outputBuffer;
}

void InflateSync(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    v8::Isolate* isolate{ args.GetIsolate() };

    const auto validArgs{ ValidateArgs(args) };

    if (!node::Buffer::HasInstance(args[0])) {
        isolate->ThrowException(v8::Exception::TypeError(
            v8::String::NewFromUtf8Literal(isolate, "The input must be a buffer")));
        return;
    }

    v8::Local<v8::Object> inputBuffer{
        args[0]->ToObject(isolate->GetCurrentContext()).ToLocalChecked()
    };

    char* input{ node::Buffer::Data(inputBuffer) };

    size_t inputLength{ node::Buffer::Length(inputBuffer) };

    int flush{ Z_SYNC_FLUSH };

    if (validArgs[1]) {
        if (!args[1]->IsInt32()) {
            isolate->ThrowException(v8::Exception::TypeError(
                v8::String::NewFromUtf8Literal(isolate, "The flush must be an integer")));
            return;
        }

        flush = args[1]->Int32Value(isolate->GetCurrentContext()).ToChecked();
    }

    int windowBits{ MAX_WBITS };

    if (validArgs[2]) {
        if (!args[2]->IsInt32()) {
            isolate->ThrowException(v8::Exception::TypeError(
                v8::String::NewFromUtf8Literal(isolate, "The window bits must be an integer")));
            return;
        }

        windowBits = args[2]->Int32Value(isolate->GetCurrentContext()).ToChecked();
    }

    size_t chunkSize{ 16 * 1024 };

    if (validArgs[3]) {
        if (!args[3]->IsInt32()) {
            isolate->ThrowException(v8::Exception::TypeError(
                v8::String::NewFromUtf8Literal(isolate, "The chunk size must be an integer")));
            return;
        }

        chunkSize = args[3]->Int32Value(isolate->GetCurrentContext()).ToChecked();

        if (chunkSize <= 0) {
            isolate->ThrowException(v8::Exception::TypeError(
                v8::String::NewFromUtf8Literal(isolate, "The chunk size must be greater than 0")));
            return;
        }
    }

    v8::Local<v8::Object> newOutputBuffer;

    inflateSyncBuffer(isolate, flush, windowBits, chunkSize, inputLength, input, newOutputBuffer);
    args.GetReturnValue().Set(newOutputBuffer);
}

void DeflateSync(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    v8::Isolate* isolate{ args.GetIsolate() };

    v8::Local<v8::Value> buf = args[0];

    if (buf->IsString()) {
        v8::String::Utf8Value str(isolate, buf);
        size_t length = str.length();

        v8::Local<v8::Object> buffer = node::Buffer::New(isolate, length).ToLocalChecked();
        std::memcpy(node::Buffer::Data(buffer), *str, length);

        buf = buffer;
    }

    if (!node::Buffer::HasInstance(buf)) {
        isolate->ThrowException(v8::Exception::TypeError(
            v8::String::NewFromUtf8Literal(isolate, "The input must be a buffer")));
        return;
    }

    v8::Local<v8::Object> inputBuffer{ buf->ToObject(isolate->GetCurrentContext())
                                           .ToLocalChecked() };

    char* input{ node::Buffer::Data(inputBuffer) };

    std::size_t inputLength{ node::Buffer::Length(inputBuffer) };

    const auto validArgs{ ValidateArgs(args) };

    std::size_t flush{ Z_FINISH };

    if (validArgs[1]) {
        if (!args[1]->IsInt32()) {
            isolate->ThrowException(v8::Exception::TypeError(
                v8::String::NewFromUtf8Literal(isolate, "The flush must be an integer")));
            return;
        }

        flush = args[1]->ToInt32(isolate->GetCurrentContext()).ToLocalChecked()->Value();
    }

    int level{ Z_DEFAULT_COMPRESSION };

    if (validArgs[2]) {
        if (!args[2]->IsInt32()) {
            isolate->ThrowException(v8::Exception::TypeError(
                v8::String::NewFromUtf8Literal(isolate, "The level must be an integer")));
            return;
        }

        level = args[2]->ToInt32(isolate->GetCurrentContext()).ToLocalChecked()->Value();
    }

    int strategy{ Z_DEFAULT_STRATEGY };

    if (validArgs[3]) {
        if (!args[3]->IsInt32()) {
            isolate->ThrowException(v8::Exception::TypeError(
                v8::String::NewFromUtf8Literal(isolate, "The strategy must be an integer")));
            return;
        }

        strategy = args[3]->ToInt32(isolate->GetCurrentContext()).ToLocalChecked()->Value();
    }

    std::size_t windowBits{ MAX_WBITS };
    if (validArgs[4]) {
        if (!args[4]->IsInt32()) {
            isolate->ThrowException(v8::Exception::TypeError(
                v8::String::NewFromUtf8Literal(isolate, "The window bits must be an integer")));
            return;
        }

        windowBits = args[4]->ToInt32(isolate->GetCurrentContext()).ToLocalChecked()->Value();
    }

    std::size_t memoryLevel{ 8 };
    if (validArgs[5]) {
        if (!args[5]->IsInt32()) {
            isolate->ThrowException(v8::Exception::TypeError(
                v8::String::NewFromUtf8Literal(isolate, "The memory level must be an integer")));
            return;
        }

        memoryLevel = args[5]->ToInt32(isolate->GetCurrentContext()).ToLocalChecked()->Value();
    }

    v8::Local<v8::Object> outputBuffer;
    deflateSyncBuffer(
        isolate, flush, windowBits, level, memoryLevel, strategy, inputLength, input, outputBuffer);
    args.GetReturnValue().Set(outputBuffer);
}

class ProcessSync : public node::ObjectWrap {
private:
    int windowBits;
    unsigned int chunkSize;
    int defaultFlush;
    const char* method;
    std::vector<char> result;

public:
    ProcessSync(const char* method, std::size_t windowBits, std::size_t chunkSize, int defaultFlush)
        : chunkSize(chunkSize)
        , windowBits(windowBits)
        , defaultFlush(defaultFlush)
        , method(method)
    {
    }

    static void Push(const v8::FunctionCallbackInfo<v8::Value>& args)
    {
        v8::Isolate* isolate{ args.GetIsolate() };
        ProcessSync* self{ ObjectWrap::Unwrap<ProcessSync>(args.This()) };
        v8::Local<v8::Object> buf;
        const char* method{ self->method };
        const bool isDeflate = strstr(method, "deflate") != NULL;

        if (args[0]->IsString() && isDeflate) {
            v8::String::Utf8Value str(isolate, args[0]);
            size_t length = str.length();

            v8::Local<v8::Object> buffer = node::Buffer::New(isolate, length).ToLocalChecked();
            std::memcpy(node::Buffer::Data(buffer), *str, length);

            buf = buffer;
        }
        else {
            buf = args[0]->ToObject(isolate->GetCurrentContext()).ToLocalChecked();
        }

        char* input = node::Buffer::Data(buf);
        size_t inputLength = node::Buffer::Length(buf);

        int flush{ self->defaultFlush };

        if (args.Length() > 1 && args[1]->IsInt32()) {
            flush = args[1]->ToInt32(isolate->GetCurrentContext()).ToLocalChecked()->Value();
        }

        v8::Local<v8::Object> r;

        int wb{ self->windowBits };
        if (strcmp(method, "inflateRaw") == NULL) {
            // Setting windowBits to -47 to allow inflate raw  (-15 Allow Raw, -32 Value to convert the windowBits)
            wb = -47;
        }
        else if (strcmp(method, "deflateRaw") == NULL) {
            // Setting windowBits to -31 to allow deflate raw  (-15 Allow Raw, -16 Value to convert the windowBits)
            wb = -31;
        }

        if (!isDeflate) {
            inflateSyncBuffer(isolate, flush, wb, self->chunkSize, inputLength, input, r);
        }
        else {
            deflateSyncBuffer(isolate, flush, wb, Z_DEFAULT_COMPRESSION, 8, Z_DEFAULT_STRATEGY,
                inputLength, input, r);
        }

        char* contents = node::Buffer::Data(r);
        const std::size_t length = node::Buffer::Length(r);

        self->result.insert(self->result.end(), contents, contents + length);
        args.GetReturnValue().Set(r);
    }

    static void New(const v8::FunctionCallbackInfo<v8::Value>& args)
    {
        v8::Isolate* isolate{ args.GetIsolate() };
        v8::Local<v8::Context> context{ isolate->GetCurrentContext() };

        if (args.IsConstructCall()) {
            int defaultFlush{ Z_SYNC_FLUSH };
            size_t windowBits{ MAX_WBITS };
            size_t chunkSize{ 16 * 1024 };
            char* method;

            if (args[0]->IsString()) {
                method = *v8::String::Utf8Value::Utf8Value(isolate, args[0]);

                if ((strcmp(method, "inflate") != NULL && strcmp(method, "deflate") != NULL
                        && strcmp(method, "inflateRaw") != NULL
                        && strcmp(method, "deflateRaw") != NULL)) {
                    isolate->ThrowException(v8::Exception::TypeError(v8::String::NewFromUtf8Literal(
                        isolate, "The method must be one of (inflate, deflate, "
                                 "inflateRaw, deflateRaw)")));
                    return;
                }
            }
            else {
                isolate->ThrowException(v8::Exception::TypeError(
                    v8::String::NewFromUtf8Literal(isolate, "Expected a method for process")));
                return;
            }

            if (args[1]->IsObject()) {
                v8::Local<v8::Object> options = args[1]->ToObject(context).ToLocalChecked();

                v8::Local<v8::Value> defaultFlushOption{
                    options->Get(context, v8::String::NewFromUtf8Literal(isolate, "defaultFlush"))
                        .ToLocalChecked()
                };
                if (defaultFlushOption->IsInt32()) {
                    defaultFlush = defaultFlushOption->ToInt32(context).ToLocalChecked()->Value();
                }

                v8::Local<v8::Value> windowBitsOption{
                    options->Get(context, v8::String::NewFromUtf8Literal(isolate, "windowBits"))
                        .ToLocalChecked()
                };
                if (windowBitsOption->IsInt32()) {
                    windowBits = windowBitsOption->ToInt32(context).ToLocalChecked()->Value();
                }

                v8::Local<v8::Value> chunkSizeOption{
                    options->Get(context, v8::String::NewFromUtf8Literal(isolate, "chunkSize"))
                        .ToLocalChecked()
                };
                if (chunkSizeOption->IsInt32()) {
                    chunkSize = chunkSizeOption->ToInt32(context).ToLocalChecked()->Value();
                }
            }

            ProcessSync* self{ new ProcessSync(method, windowBits, chunkSize, defaultFlush) };
            self->Wrap(args.This());
            args.GetReturnValue().Set(args.This());
        }
        else {
            isolate->ThrowException(v8::Exception::TypeError(v8::String::NewFromUtf8Literal(
                isolate, "Use the new operator to create instances of this object.")));
            return;
        }
    }

    static void GetChunkSize(
        v8::Local<v8::String> property, const v8::PropertyCallbackInfo<v8::Value>& args)
    {
        ProcessSync* self = ObjectWrap::Unwrap<ProcessSync>(args.This());

        args.GetReturnValue().Set(self->chunkSize);
    }

    static void GetWindowBits(
        v8::Local<v8::String> property, const v8::PropertyCallbackInfo<v8::Value>& args)
    {
        ProcessSync* self = ObjectWrap::Unwrap<ProcessSync>(args.This());

        args.GetReturnValue().Set(self->windowBits);
    }

    static void GetDefaultFlush(
        v8::Local<v8::String> property, const v8::PropertyCallbackInfo<v8::Value>& args)
    {
        ProcessSync* self = ObjectWrap::Unwrap<ProcessSync>(args.This());

        args.GetReturnValue().Set(self->defaultFlush);
    }

    static void GetResult(
        v8::Local<v8::String> property, const v8::PropertyCallbackInfo<v8::Value>& args)
    {
        ProcessSync* self = ObjectWrap::Unwrap<ProcessSync>(args.This());

        if (self->result.size() == 0) {
            args.GetReturnValue().Set(v8::Null(args.GetIsolate()));
        }
        else {
            v8::Local<v8::Object> resultBuffer
                = node::Buffer::Copy(args.GetIsolate(), self->result.data(), self->result.size())
                      .ToLocalChecked();
            args.GetReturnValue().Set(resultBuffer);
        }
    }

    static void Init(v8::Local<v8::Object> exports)
    {
        v8::Isolate* isolate{ exports->GetIsolate() };

        v8::Local<v8::FunctionTemplate> tpl{ v8::FunctionTemplate::New(isolate, New) };

        tpl->SetClassName(v8::String::NewFromUtf8Literal(isolate, "ProcessSync"));
        v8::Local<v8::ObjectTemplate> iTpl{ tpl->InstanceTemplate() };
        iTpl->SetInternalFieldCount(1);

        iTpl->SetAccessor(v8::String::NewFromUtf8Literal(isolate, "chunkSize"), GetChunkSize);
        iTpl->SetAccessor(v8::String::NewFromUtf8Literal(isolate, "windowBits"), GetWindowBits);
        iTpl->SetAccessor(v8::String::NewFromUtf8Literal(isolate, "defaultFlush"), GetDefaultFlush);
        iTpl->SetAccessor(v8::String::NewFromUtf8Literal(isolate, "result"), GetResult);

        NODE_SET_PROTOTYPE_METHOD(tpl, "push", Push);

        v8::Local<v8::Context> context{ isolate->GetCurrentContext() };
        v8::Local<v8::Function> constructor{ tpl->GetFunction(context).ToLocalChecked() };
        exports->Set(context, v8::String::NewFromUtf8Literal(isolate, "ProcessSync"), constructor);
    }
};

void Init(v8::Local<v8::Object> exports)
{
    v8::Isolate* isolate = exports->GetIsolate();
    v8::Local<v8::Context> context = isolate->GetCurrentContext();
    v8::Local<v8::Object> constants = v8::Object::New(isolate);

#define SET_CONSTANT(prop)                                                  \
    constants->Set(context, v8::String::NewFromUtf8Literal(isolate, #prop), \
        v8::Integer::New(isolate, static_cast<int32_t>(prop)));

    SET_CONSTANT(Z_NO_FLUSH);
    SET_CONSTANT(Z_PARTIAL_FLUSH);
    SET_CONSTANT(Z_SYNC_FLUSH);
    SET_CONSTANT(Z_FULL_FLUSH);
    SET_CONSTANT(Z_FINISH);
    SET_CONSTANT(Z_BLOCK);
    SET_CONSTANT(Z_TREES);
    SET_CONSTANT(Z_OK);
    SET_CONSTANT(Z_STREAM_END);
    SET_CONSTANT(Z_NEED_DICT);
    SET_CONSTANT(Z_ERRNO);
    SET_CONSTANT(Z_STREAM_ERROR);
    SET_CONSTANT(Z_DATA_ERROR);
    SET_CONSTANT(Z_MEM_ERROR);
    SET_CONSTANT(Z_BUF_ERROR);
    SET_CONSTANT(Z_VERSION_ERROR);
    SET_CONSTANT(Z_BEST_COMPRESSION);
    SET_CONSTANT(Z_BEST_SPEED);
    SET_CONSTANT(Z_TEXT);
    SET_CONSTANT(Z_NULL);
    SET_CONSTANT(Z_UNKNOWN);
    SET_CONSTANT(Z_RLE);
    SET_CONSTANT(Z_DEFAULT_COMPRESSION);
    SET_CONSTANT(Z_DEFAULT_STRATEGY);
    SET_CONSTANT(Z_DEFLATED);
    SET_CONSTANT(Z_HUFFMAN_ONLY);
    SET_CONSTANT(Z_NO_COMPRESSION);
    SET_CONSTANT(Z_STREAM_ERROR);
    SET_CONSTANT(Z_BINARY);
    SET_CONSTANT(Z_ASCII);

    exports->Set(context, v8::String::NewFromUtf8Literal(isolate, "constants"), constants);

    NODE_SET_METHOD(exports, "inflate", InflateSync);
    NODE_SET_METHOD(exports, "deflate", DeflateSync);

    ProcessSync::Init(exports);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init);
}