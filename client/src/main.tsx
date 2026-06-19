import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import { GoogleAuthPopup } from "./components/GoogleAuthButton/index.ts";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { PublicRoute } from "./components/PublicRoute.tsx";
import { AuthProvider } from "./context/auth/index.ts";
import { Layout } from "./layouts/Layout/index.ts";
import { Home } from "./pages/Home/index.ts";
import { Login } from "./pages/Login/index.ts";
import { Register } from "./pages/Register.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route element={<Layout />}>
						<Route element={<PublicRoute />}>
							<Route element={<Login />} path="/login" />
							<Route element={<Register />} path="/register" />
						</Route>
						<Route element={<GoogleAuthPopup />} path="/oauth/callback" />
						<Route element={<ProtectedRoute />}>
							<Route element={<Home />} index />
						</Route>
						<Route element={<p>Page not found</p>} path="*" />
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);
