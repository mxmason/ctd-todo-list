import * as React from "react";
import { useNavigate } from "react-router";

import { useAuth } from "#context/auth/useAuth.ts";

export function GoogleAuthPopup() {
	const navigate = useNavigate();

	React.useEffect(() => {
		const hasError = new URLSearchParams(window.location.search).has("error");
		if (window.opener) {
			if (!hasError) {
				window.opener.postMessage(
					{ type: "oauth:success" },
					window.location.origin,
				);
			}
			window.close();
		} else {
			void navigate(hasError ? "/login" : "/", { replace: true });
		}
	}, [navigate]);

	return null;
}

export function GoogleAuthButton() {
	const { refreshUser } = useAuth();
	const navigate = useNavigate();

	React.useEffect(() => {
		const onMessage = async (evt: MessageEvent) => {
			if (evt.origin !== window.location.origin) return;
			if ((evt.data as { type?: string })?.type !== "oauth:success") return;
			await refreshUser();
			await navigate("/");
		};
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	}, [refreshUser, navigate]);

	const handleClick = () => {
		window.open(
			"/api/auth/google",
			"google-oauth",
			"popup,width=500,height=600",
		);
	};

	return (
		<button type="button" onClick={handleClick}>
			Sign in with Google
		</button>
	);
}
