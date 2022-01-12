export default {
  // 系统错误
  COMMON_ERROR_INTERNAL: 'common.error.internal',
  // 请求参数错误
  COMMON_ERROR_REQUEST_UNMARSHAL: 'common.error.requestUnmarshal',
  // 记录不存在
  LAVA_ERROR_NO_RECORDS: 'lava.error.no.records',
  // api秘钥 - 一个用户最多创建两个秘钥
  LAVA_ERROR_SECRETKEY_TOOMANY: 'lava.error.secretKey.tooMany',
  // 用户名或密码错误
  LAVA_ERROR_LOGIN_CREDENTIAL_INVALID: 'lava.error.login.credentialInvalid',
  // 密码已过期，需要重置密码
  LAVA_ERROR_LOGIN_PASSWORD_EXPIRED: 'lava.error.login.passwordExpired',
  // 密码错误次数过多
  LAVA_ERROR_LOGIN_FAIL_TIMES: 'lava.error.login.failTimes',
  // 手机验证码错误
  LAVA_ERROR_REGISTER_VERIFY_CODE: 'lava.error.register.verifyCode',
  // 手机验证码过期
  LAVA_ERROR_VERIFY_CODE_EXPIRED: 'lava.error.verifyCode.expired',
  // 用户未激活
  LAVA_ERROR_LOGIN_USER_INACTIVE: 'lava.error.login.userInactive',
  // 用户未审批通过
  LAVA_ERROR_LOGIN_USER_NOT_APPROVED: 'lava.error.login.userNotApproved',
  // 需要重置密码
  LAVA_ERROR_LOGIN_PASSWORD_RESET: 'lava.error.login.passwordReset',
  // 审批中
  LAVA_ERROR_LOGIN_NEED_APPROVE: 'lava.error.login.needApprove',
  // 新用户首次登录需要重置密码
  LAVA_ERROR_LOGIN_NEW_USER: 'lava.error.login.newUser',
  // 用户名已存在
  LAVA_ERROR_EXIST_USER_DUPLICATE: 'lava.error.exist.userDuplicate',
  // 手机号已存在
  LAVA_ERROR_EXIST_PHONE_DUPLICATE: 'lava.error.exist.phoneDuplicate',
  // 密码格式错误
  LAVA_ERROR_CHANGE_PASSWORD_PASSWORD_FORMAT: 'lava.error.changePassword.passwordFormat',
  // 邮箱已存在
  LAVA_ERROR_EXIST_EMAIL_DUPLICATE: 'lava.error.exist.emailDuplicate',
  // 用户不存在
  LAVA_ERROR_USER_NOT_FOUND: 'lava.error.user.notFound',
  // 图片验证码不正确
  LAVA_ERROR_VERIFY_CAPTCHA_CODE_INCORRECT: 'lava.error.verifyCaptcha.codeIncorrect',
}