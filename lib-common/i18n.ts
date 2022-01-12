// 使用BCP-47语言标识规范 https://juejin.cn/post/6844903863556767758
// 常用地区见 https://www.techonthenet.com/js/language_tags.php
import errors from './errors'
export default {
  'zh-CN': {
    // 一般类别
    common: {},
    // 错误
    errors: {
      [errors.COMMON_ERROR_INTERNAL]: '系统错误',
      [errors.COMMON_ERROR_REQUEST_UNMARSHAL]: '请求参数错误',
      [errors.LAVA_ERROR_CHANGE_PASSWORD_PASSWORD_FORMAT]: '请输入正确的8-50位由数字，字母（包含大小写）和符号组合的密码',
      [errors.LAVA_ERROR_EXIST_EMAIL_DUPLICATE]: '邮箱已被使用，请重新输入',
      [errors.LAVA_ERROR_EXIST_PHONE_DUPLICATE]: '手机号已被使用，请重新输入',
      [errors.LAVA_ERROR_EXIST_USER_DUPLICATE]: '用户名已存在，请重新输入',
      [errors.LAVA_ERROR_LOGIN_CREDENTIAL_INVALID]: '请输入正确的用户名,子用户名@主账号ID,手机号或密码',
      [errors.LAVA_ERROR_LOGIN_FAIL_TIMES]: {
        // 主账号
        master: '由于您密码输入错误次数过多，该账户已锁定暂时无法登录，您可以选择找回密码后在重新尝试',
        // 子账号
        subuser: '由于您密码输入错误次数过多，该账户已锁定暂时无法登录，请联系主账号修改密码解锁账户',
      },
      [errors.LAVA_ERROR_LOGIN_NEED_APPROVE]: '该用户正在审批中，请联系主账号确认',
      [errors.LAVA_ERROR_LOGIN_NEW_USER]: '新用户，需要重置密码',
      [errors.LAVA_ERROR_LOGIN_PASSWORD_EXPIRED]: '密码已过期，需要重置密码',
      [errors.LAVA_ERROR_LOGIN_PASSWORD_RESET]: '需要重置密码',
      [errors.LAVA_ERROR_LOGIN_USER_INACTIVE]: '用户未激活',
      [errors.LAVA_ERROR_LOGIN_USER_NOT_APPROVED]: '用户审批未通过',
      [errors.LAVA_ERROR_NO_RECORDS]: '记录不存在',
      [errors.LAVA_ERROR_REGISTER_VERIFY_CODE]: '验证码错误，请检查后重新输入',
      [errors.LAVA_ERROR_SECRETKEY_TOOMANY]: '一个用户最多创建两个秘钥',
      [errors.LAVA_ERROR_USER_NOT_FOUND]: '请输入正确的用户名,子用户名@主账号ID,手机号或密码',
      [errors.LAVA_ERROR_VERIFY_CAPTCHA_CODE_INCORRECT]: '验证码错误，请检查后重新输入',
      [errors.LAVA_ERROR_VERIFY_CODE_EXPIRED]: '验证码已过期，请重新获取后输入',
    }
  }
}