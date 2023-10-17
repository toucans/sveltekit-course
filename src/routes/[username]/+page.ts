//IF WE ONLY WANTED THIS CODE TO RUN ON THE SERVER, WE COULD SIMPLY CHANGE THIS FILE TO A +page.server.ts FILE
//The main drawback though, is that when fetching data from a load function, you can't use real-time data.
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import type { PageLoad } from './$types';
import { db } from '$lib/firebase';
import { error } from '@sveltejs/kit';

//The load function receives a context object (which is being destructured to { params } in your code). This object contains information about the current page, the session, and other details.
//The load function is part of the default template when a new page.ts file is created.
export const load = (async ({ params }) => {
	//In svelte load is a function that runs when a page is first loaded and can be used to fetch data that the page depends on. It can be included in a page's module context (in a Svelte component file).
	const collectionRef = collection(db, 'users');

	const q = query(collectionRef, where('username', '==', params.username), limit(1)); //Limit query to 1 dacument, as there can only be 1 username
	const snapshot = await getDocs(q); //returns an array of document snapchots from firefase
	const exists = snapshot.docs[0]?.exists(); //determine if document exists
	const data = snapshot.docs[0]?.data();

	if (!exists) {
		throw error(404, 'that user does not exist!'); //throw error with svelte's error function
	}

	if (!data.published) {
		throw error(403, `The profile of @${data.username} is not public!`); //403 unauthorized
	}
	//SvelteKit will fall back to the nearest error component instead of rendering the main component. We don't have to deal with error handling in the front-end client-side code this way.

	return {
		//return object contining the field we want to use in the front-end svelte component. Strongly typed.
		username: data.username,
		photoURL: data.photoURL,
		bio: data.bio,
		links: data.links ?? []
	};
}) satisfies PageLoad;
