import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import { GoogleAuthPopup } from "./components/GoogleAuthButton/GoogleAuthButton.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { PublicRoute } from "./components/PublicRoute.tsx";
import { AuthProvider } from "./context/auth/AuthContext.tsx";
import { Layout } from "./layouts/Layout/Layout.tsx";
import { Home } from "./pages/Home/Home.tsx";
import { Login } from "./pages/Login/Login.tsx";
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
