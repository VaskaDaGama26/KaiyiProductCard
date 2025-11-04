class FormsValidation {
  selectors = {
    form: "[data-js-form]",
    fieldErrors: "[data-js-form-input-errors]"
  };

  errorMessages = {
    valueMissing: () => "Пожалуйста, заполните это поле",
    patternMismatch: ({ title }) => title || "Данные не соответствуют формату",
    tooShort: ({ minLength }) =>
      `Слишком короткое значение, минимум символов — ${minLength}`,
    tooLong: ({ maxLength }) =>
      `Слишком длинное значение, ограничение символов — ${maxLength}`
  };

  constructor() {
    this.bindEvents();
  }

  manageErrors(inputControlElement, errorMessages) {
    const wrapper = inputControlElement.closest(".input__wrapper");
    const inputErrorsElement = wrapper.querySelector(
      this.selectors.fieldErrors
    );

    inputErrorsElement.innerHTML = errorMessages
      .map((message) => `<span class="input__error">${message}</span>`)
      .join("");
  }

  validateInput(inputControlElement) {
    const errors = inputControlElement.validity;
    const errorMessages = [];

    Object.entries(this.errorMessages).forEach(
      ([errorType, getErrorMessage]) => {
        if (errors[errorType]) {
          errorMessages.push(getErrorMessage(inputControlElement));
        }
      }
    );
    this.manageErrors(inputControlElement, errorMessages);

    const isValid = errorMessages.length === 0;

    inputControlElement.ariaInvalid = !isValid;

    return isValid;
  }

  onChange(event) {
    const { target } = event;
    const isRequired = target.required;
    const isToggleType = ["radio", "checkbox"].includes(target.type);

    if (isToggleType && isRequired) {
      this.validateInput(target);
    }
  }
  onBlur(event) {
    const { target } = event;
    const isFormField = target.closest(this.selectors.form);
    const isRequired = target.required;
    if (isFormField && isRequired) {
      this.validateInput(target);
    }
  }
  onSubmit(event) {
    const isFormElement = event.target.matches(this.selectors.form);

    if (!isFormElement) {
      return;
    }

    const requiredControlElements = [...event.target.elements].filter(
      ({ required }) => required
    );

    let isFormValid = true;
    let firstInvalidInputControl = null;

    requiredControlElements.forEach((element) => {
      const isInputValid = this.validateInput(element);

      if (!isInputValid) {
        isFormValid = false;

        if (!firstInvalidInputControl) {
          firstInvalidInputControl = element;
        }
      }
    });

    if (!isFormValid) {
      event.preventDefault();
      firstInvalidInputControl.focus();
    }
  }

  bindEvents() {
    document.addEventListener(
      "blur",
      (event) => {
        this.onBlur(event);
      },
      { capture: true }
    );
    document.addEventListener("change", (event) => {
      this.onChange(event);
    });
    document.addEventListener("submit", (event) => {
      this.onSubmit(event);
    });
  }
}

new FormsValidation();
