<script>
	import { route } from '$lib/ROUTES';

	import Button from '$components/ui/button/button.svelte';
	import SiteMainNav from './SiteMainNav.svelte';
	// import SiteMainNavMenuToggleBtn from './SiteMainNavMenuToggleBtn.svelte';
	import ThemeToggler from './ThemeToggler.svelte';
</script>
<!-- เเถบเส้นตรง nav bar -->
<header class="relative mb-10 border-b">
	<!-- เเถบ NAVBAR -->
	<div class="container flex items-center justify-between p-2 bg-[#102C57]">
		<Button href={route('/')} variant="link" class="text-white font-bold text-xl">OURTRAIN</Button>
		<div class="flex gap-2">
			<SiteMainNav />
			<ThemeToggler />
			<!-- <SiteMainNavMenuToggleBtn /> -->
		</div>
	</div>
</header>
