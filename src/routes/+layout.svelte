<script lang="ts">
	import { user, userData } from '$lib/firebase';
	import '../app.css';

	$user; //Subscribing to these in the route layout is a good idea. Preload global data.
	$userData;
</script>

<div class="min-h-screen flex flex-col">
	<slot />
</div>
