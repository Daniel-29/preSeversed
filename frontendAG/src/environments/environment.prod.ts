export const environment = {
  production: true,
  apiUrl:'https://192.168.1.37:3060/',
  TextValidation:'[a-zA-Z0-9 ]*',
  PasswordValidation:'(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}',
  LettersValidation:'[a-zA-Z ]*',
  NumbersValidation:'[0-9]*',
};
