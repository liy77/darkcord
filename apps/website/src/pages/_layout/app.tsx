import { Outlet } from "react-router-dom";

export default function AppLayout() {
	return (
		<div className="min-h-screen bg-background font-sans antialiased">
			<Outlet />
		</div>
	);
}
