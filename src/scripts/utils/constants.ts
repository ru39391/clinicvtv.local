export const SITE_URL = '';
export const API_URL = `${SITE_URL}${import.meta.env.VITE_API_URL}`;
export const TPL_URL = `${import.meta.env.VITE_ASSETS_PATH}${import.meta.env.VITE_TPL_PATH}`;

export const FORM_SELECTORS = {
  form: '.js-form',
  formContent: '.js-form-content',
  formTitle: '.js-form-title',
  formSuccess: '.js-form-content-success',
  formFailure: '.js-form-content-failure',
  formHeader: '.js-form-header',
  submitBtn: '.js-form-submit',
  inputHolder: '.js-input-holder',
  input: '.js-input-field',
  inputTitle: '.js-input-title',
  select: '.js-select',
  checkbox: '.js-input-checkbox',
  textarea: '.js-textarea',
  errorContent: '.js-error-message',
}

export const RESPONSE_DATA = {
  data: {},
  success: false,
  message: "Некорректный запрос",
};

export const STATE_MOD = {
  active: 'is-active',
  error: 'is-error',
  hidden: 'is-hidden',
  visible: 'is-visible',
}
