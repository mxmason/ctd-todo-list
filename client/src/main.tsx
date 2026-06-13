import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import { Layout } from "./layouts/Layout";
import { Home } from "./pages/Home";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route element={<Home />} index />
					<Route element={<p>Page not found</p>} path="*" />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
