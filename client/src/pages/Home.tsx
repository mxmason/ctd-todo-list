import * as React from "react";

export function Home() {
	React.useEffect(() => {
		fetch("/api/hello/World")
			.then((res) => res.json())
			.then((data) => console.log(data));
	}, []);
	return <h1>Hello world</h1>;
}
