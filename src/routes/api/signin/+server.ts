import { adminAuth } from '$lib/server/admin';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	//post request to sign in
	const { idToken } = await request.json(); //pass idToken from google signin to server-side endpoint

	const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days. Default is 14 days.

	const decodedIdToken = await adminAuth.verifyIdToken(idToken); //method from the admin SDK. Decodes token securely on server to give access to its data.

	if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
		//added security measure, make sure auth_time of token was less than 5 minutes ago. A cookie should only be set if the user authenticated recently.
		const cookie = await adminAuth.createSessionCookie(idToken, { expiresIn }); //create cookie using the adminAuth SDK.
		const options = { maxAge: expiresIn, httpOnly: true, secure: true, path: '/' }; //set path value, because by default it will only be scopen to the URL in which is was created.

		cookies.set('__session', cookie, options); //use SvelteKit to set cookie in the application. Cookie name needs to be '__session' for firebase to cache it to a CDN.

		return json({ status: 'signedIn' });
	} else {
		throw error(401, 'Recent sign in required!');
	}
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	//delete request to sign out
	cookies.delete('__session', { path: '/' }); //delete cookie with SvelteKit
	return json({ status: 'signedOut' });
};
