import Yup from "yup";

const signUpValidation = Yup.object({
  email: Yup.string().required().email(),
  password: Yup.string().required(),
});

export default { signUpValidation };
