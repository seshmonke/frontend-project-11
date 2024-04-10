import i18n from 'i18next';
import * as yup from 'yup';
import renderOnChange from './render.js';
import resources from './locales/index.js';

export default () => {
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  });

  const initModel = () => {
    const initialState = {
      form: {
        state: 'filling',
        errorType: null,
      },
      rssList: [],
    };

    const urlInputElement = document.querySelector('#url-input');
    const formElement = document.querySelector('form');
    const errorMessageElement = formElement.nextElementSibling.nextElementSibling;

    const elements = { urlInputElement, formElement, errorMessageElement };

    return {
      elements, initialState,
    };
  };

  const { elements, initialState } = initModel();

  const state = renderOnChange(initialState, elements, i18nInstance);

  yup.setLocale({
    string: {
      url: i18nInstance.t('url'),
      required: i18nInstance.t('required'),
      notOneOf: i18nInstance.t('notOneOf'),
    },
  });

  const validate = (url, links) => {
    const schema = yup.string()
      .url()
      .required()
      .notOneOf(links);
    return schema.validate(url);
  };

  elements.formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.formElement.elements.url;
    validate(value, state.rssList)
      .then((url) => {
        state.form.state = 'sending';
        state.form.errorType = null;
        state.rssList = [...state.rssList, url];
      })
      .catch((error) => {
        state.form.state = 'failed';
        state.form.errorType = error.type;
      });
    console.log(state);
  });
};
