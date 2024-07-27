import { AbstractControl, ValidatorFn } from '@angular/forms';

export function urlValidator(subType: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (subType === 'youtube') {
      const isIframe = /<iframe.*?<\/iframe>/i.test(control.value);
      return isIframe ? null : { invalidIframe: true };
    } else if (subType === 'podcast') {
      const isHttpUrl = /^https?:\/\/.+/.test(control.value);
      return isHttpUrl ? null : { invalidHttpUrl: true };
    }
    return null;
  };
}
