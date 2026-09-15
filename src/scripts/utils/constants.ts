export const SITE_URL = '';
export const API_URL = `${SITE_URL}${import.meta.env.VITE_API_URL}`;
export const TPL_URL = `${import.meta.env.VITE_ASSETS_PATH}${import.meta.env.VITE_TPL_PATH}`;

export const ERROR_MESSAGES = {
  formInvalid: 'Поля формы заполнены неверно',
  phoneInvalid: 'Неверно введен телефон',
  emailInvalid: 'Неверно введен e-mail',
  textInvalid: 'Недопустимые символы',
  selectInvalid: 'Ничего не выбрано',
  inputRequired: 'Поле не может быть пустым',
  minLengthInvalid: 'Слишком короткое значение',
  maxLengthInvalid: 'Значение слишком длинное'
};

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
  reqCheckbox: '.js-checkbox-required'
}

export const INPUT_CLASSNAMES = {
  phoneInput: 'js-input-type-phone',
  emailInput: 'js-input-type-email',
  defaultInput: 'js-input-type-default',
  inputOptional: 'js-optional'
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
