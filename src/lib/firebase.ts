import { initializeApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { writable, type Readable, derived } from 'svelte/store';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDcwoMc1Yad2RHFKpzaPuCEroH48W7wGJM',
	authDomain: 'svelte-course-0.firebaseapp.com',
	projectId: 'svelte-course-0',
	storageBucket: 'svelte-course-0.appspot.com',
	messagingSenderId: '89786419291',
	appId: '1:89786419291:web:58713da3f45b33b4db977e',
	measurementId: 'G-PWTVPHEMY3'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

/**
 * @returns a store with the current firebase user
 */
function userStore() {
	let unsubscribe: () => void;

	if (!auth || !globalThis.window) {
		console.warn('Auth is not initialized or not in browser');
		const { subscribe } = writable<User | null>(null);
		return {
			subscribe
		};
	}

	//The callback function for writable is designed to accept only one function as its argument, which is the set function.
	const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
		//Callback function is optional when declaring a scelte store. The first argument to that callback function will be the set function. The name you give to that argument is up to you. Conventionally, it's named set, but you could name it whatever you like.
		unsubscribe = onAuthStateChanged(auth, (user) => {
			//This is a Firebase Auth method that sets up a listener on the authentication state. Whenever a user logs in, logs out, or there's any change in the authentication state, the provided callback is called.
			set(user);
		});

		return () => unsubscribe();
	});

	return {
		//returns an object with only the subscribe method, effectively providing a read-only store.
		subscribe //only the subscribe method is extracted from the store, ensuring that other parts of the code can only read the store's value but cannot modify it directly.
	};
}

export const user = userStore();

/**
 * @param  {string} path document path or reference
 * @param  {any} startWith optional default data
 * @returns a store with realtime updates on document data
 */
export function docStore<T>(path: string) {
	//Universal way to listen to firestore documents in svelte. Will automatically provide real-time data, and automatically unsubscribe when it's no longer needed
	let unsubscribe: () => void;

	const docRef = doc(db, path);

	const { subscribe } = writable<T | null>(null, (set) => {
		unsubscribe = onSnapshot(docRef, (snapshot) => {
			set((snapshot.data() as T) ?? null);
		});

		return () => unsubscribe();
	});

	return {
		subscribe,
		ref: docRef,
		id: docRef.id
	};
}

interface UserData {
	//To provide intellisesnse for the field we intend to read from the document
	username: string;
	bio: string;
	photoURL: string;
	published: boolean;
	links: any[];
}

export const userData: Readable<UserData | null> = derived(user, ($user, set) => {
	//A derived store takes two or more stores and combine into a single value
	if ($user) {
		return docStore<UserData>(`users/${$user.uid}`).subscribe(set); //Return subscription to our custom docStore if user is logged in
	} else {
		set(null); //Null if user is not logged in
	}
}); //Now we can access the user document along with username anywhere in the application with real-time updates with this generic interface
