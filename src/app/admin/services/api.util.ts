import { HttpParams, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { NotificationsService, Notification } from 'angular2-notifications';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ErrorMessage } from "../model/api.model";

const className = "apiCallWrapper";

let offlineNotification: Notification | null = null;

/**
 * @description Wraps an API call observable with error handling, notifications, and success notifications.
 * @param {Observable<N>} observable - The API call observable to be wrapped.
 * @param {Object} opts - Options for configuring the behavior of the wrapper.
 * @param {NotificationsService} opts.notificationsService - The notifications service used for displaying notifications.
 * @param {string} opts.action - The action being performed by the API call.
 * @param {string} [opts.title] - The title for the notification displayed during the API call.
 * @param {string} [opts.message] - The message for the notification displayed during the API call.
 * @param {string} [opts.successTitle] - The title for the success notification displayed after a successful API call.
 * @param {string} [opts.failTitle] - The title for the fail notification displayed after a failed API call.
 * @param {string} [opts.successMessage] - The message for the success notification displayed after a successful API call.
 * @param {D} [opts.defaultValue] - The default value to return if the entity is not found, instead of an error (eg: null)
 * @returns {Observable<N>} - The wrapped API call observable.
 * @example
 * ```
 * const observable = apiCallWrapper(
 *   someApiCallObservable,
 *   {
 *     notificationsService: myNotificationsService,
 *     action: 'Get Data',
 *     title: 'Fetching data',
 *     message: 'Please wait...',
 *     successTitle: 'Data Retrieved',
 *     failTitle: 'Error retrieving data',
 *     successMessage: 'Data retrieval completed',
 *     defaultValue: []
 *   }
 * );
 *
 * observable.subscribe(
 *   data => console.log('API call success:', data),
 *   error => console.error('API call error:', error)
 * );
 * ```
 */
export const apiCallWrapper = <D, N>(observable: Observable<N>, opts: {
	notificationsService?: NotificationsService,
	action: string,
	title?: string,
	message?: string,
	successTitle?: string,
	failTitle?: string,
	successMessage?: string,
	defaultValue?: D
}): typeof observable => {
	const signature = className + ".apiCallWrapper: ";
	const options = Object.assign({},
		opts,
		{
			title: opts.action,
			successTitle: `${opts.action} complete`,
			failTitle: `${opts.action} failed`,
			message: '',
			successMessage: opts.message ? `${opts.message} completed` : ''
		}
	);
	const notifcation = options.notificationsService ? options.notificationsService.warn(options.title, options.message) : null;

	const removeExistingNotification = () => options.notificationsService && notifcation ? options.notificationsService.remove(notifcation.id) : void (0);

	// Sent to true when there was a gracefully handled error and the default value was returned.
	let didNotSucceed = false;

	// Ensure no offline notifications are being displayed if an offline state is not detected
	if (options.notificationsService && offlineNotification && window.navigator.onLine) {
		options.notificationsService.remove(offlineNotification.id);
		offlineNotification = null;
	}

	if (!window.navigator.onLine) {
		removeExistingNotification();

		// Set an offline notification if one doesn't already exist

		if (options.notificationsService && (!offlineNotification || offlineNotification.destroyedOn)) {
			offlineNotification = options.notificationsService.error(options.failTitle, "No internet connection available.");

			if (offlineNotification.click) {
				offlineNotification.click.subscribe(() => {
					if (!options.notificationsService) return;

					options.notificationsService.remove(offlineNotification!.id);
					offlineNotification = null;
				});
			}

			if (offlineNotification.timeoutEnd) {
				offlineNotification.timeoutEnd.subscribe(() => {
					if (!options.notificationsService) return;

					options.notificationsService.remove(offlineNotification!.id);
					offlineNotification = null;
				});
			}
		}

		const handledError = new ErrorMessage({ message: "Browser is offline", handled: true });
		return throwError(handledError);
	}

	return observable.pipe(
		catchError(err => {
			removeExistingNotification();

			// Prevent duplicate handling of the error
			if (err instanceof ErrorMessage) {
				if (err.handled) {
					return NEVER;
				}

				return throwError(err);
			}

			if (hasKey(err, 'error') && hasKey(err.error, 'message') && hasKey(err.error, 'statusCode')) {
				const error = new ErrorMessage().deserialize(err.error as Partial<ErrorMessage>);

				if (options.notificationsService) options.notificationsService.error(options.failTitle, error.message);

				if (error.statusCode === 404 && opts.defaultValue) {
					didNotSucceed = true;
					return of(options.defaultValue);
				}

				return throwError(error);
			}

			if (err instanceof HttpErrorResponse && err.status === 0) {
				if (options.notificationsService) options.notificationsService.error(options.failTitle, "Error communicating with server");

				const handledError = new ErrorMessage({ handled: true });

				return throwError(handledError);
			}

			if (options.notificationsService) options.notificationsService.error(options.failTitle, "Unknown Error has Occurred");

			return throwError(new ErrorMessage());
		}),
		map(
			result => {
				removeExistingNotification();

				if (!didNotSucceed) {
					if (options.notificationsService) options.notificationsService.success(options.successTitle, options.successMessage);
				}

				return result as N;
			}
		)
	);
}

/**
 * @description Checks if the provided object has a specific property key.
 * @param {unknown} obj - The object to check for the property key.
 * @param {PropertyKey} prop - The property key to check.
 * @returns {obj is X & Record<Y, unknown>} - A boolean value indicating whether the object has the specified property key.
 * @example
 * ```
 * const person = { name: 'John', age: 30 };
 *
 * console.log(hasKey(person, 'name')); // true
 * console.log(hasKey(person, 'email')); // false
 * ```
 */

export function hasKey<X extends {}, Y extends PropertyKey>(obj: unknown, prop: Y): obj is X & Record<Y, unknown> {
	return obj !== null && obj !== undefined && Object.prototype.hasOwnProperty.call(obj, prop) || (isRecord(obj) && prop in (obj as Record<string, unknown>));
}

/**
 * @description Checks if the provided object is a record (plain JavaScript object) with string keys and unknown values.
 * @param {unknown} obj - The object to check.
 * @returns {obj is Record<string, unknown>} - A boolean value indicating whether the object is a record.
 * @example
 * ```
 * const obj1 = { name: 'John', age: 30 };
 * const obj2 = [1, 2, 3];
 *
 * console.log(isRecord(obj1)); // true
 * console.log(isRecord(obj2)); // false
 * ```
 */
export const isRecord = (obj: unknown): obj is Record<string, unknown> => {
	return (
		typeof obj === "object" ||
		typeof obj === 'function' ||
		(
			obj instanceof Object &&
			!(obj instanceof Array)
		)
	) && (
			obj !== null &&
			obj !== undefined
		)
}
