<script>
	import { onMount } from "svelte";

	let email = '';
	let password = '';
	let message = '';

	async function handleSignup() {
		const res = await fetch('/api/auth/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});
		const data = await res.json();
		message = data.message;
	}

	async function handleLogin() {
		const res = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});
		const data = await res.json();
		message = data.message;
	}

	async function handleLogout() {
		const res = await fetch('/api/auth/logout', {
			 method: 'POST',
			 credentials: 'include' 
			});
		const data = await res.json();
		message = data.message;
	}

	async function testProtected() {
		const res = await fetch('/api/protected');
		if (res.status === 401) {
			// 만약 access 만료라면 refresh
			const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
			if (refreshRes.ok) {
				// 리프레시 성공 -> 다시 api 호출
				const retryRes = await fetch('/api/protected');
				const retryData = await retryRes.json();
				message = retryData.message || 'retry fail?';
			} else {
				// refresh 만료
				message = (await refreshRes.json()).message || 'Need re-login';
			}
		} else {
			// 200 or other
			const data = await res.json();
			message = data.message;
		}
	}
</script>

<h1>Auth Demo</h1>
<input bind:value={email} placeholder="Email" />
<input type="password" bind:value={password} placeholder="Password" />
<br />

<button on:click={handleSignup}>Signup</button>
<button on:click={handleLogin}>Login</button>
<button on:click={handleLogout}>Logout</button>
<button on:click={testProtected}>Call Protected API</button>

<p>{message}</p>