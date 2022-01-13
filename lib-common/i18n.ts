// 使用BCP-47语言标识规范 https://juejin.cn/post/6844903863556767758
// 常用地区见 https://www.techonthenet.com/js/language_tags.php
import { useI18n } from 'vue-i18n'
import { Response } from "./http";

export const messages = {
  'zh-CN': {
    // 一般类别
    common: {},
    // 错误
    errors: {
      'common.error.internal': '系统错误',
      'common.error.requestUnmarshal': '请求参数错误',
      'lava.error.changePassword.passwordFormat': '请输入正确的8-50位由数字，字母（包含大小写）和符号组合的密码',
      'lava.error.exist.emailDuplicate': '邮箱已被使用，请重新输入',
      'lava.error.exist.phoneDuplicate': '手机号已被使用，请重新输入',
      'lava.error.exist.userDuplicate': '用户名已存在，请重新输入',
      // 注意 @ 是vue-i18n的特殊字符，需要改成{'@'}
      'lava.error.login.credentialInvalid': `请输入正确的用户名，子用户名{'@'}主账号ID，手机号或密码`,
      'lava.error.login.failTimes': {
        // 主账号
        master: '由于您密码输入错误次数过多，该账户已锁定暂时无法登录，您可以选择找回密码后在重新尝试',
        // 子账号
        subUser: '由于您密码输入错误次数过多，该账户已锁定暂时无法登录，请联系主账号修改密码解锁账户',
      },
      'lava.error.login.needApprove': '该用户正在审批中，请联系主账号确认',
      'lava.error.login.newUser': '新用户，需要重置密码',
      'lava.error.login.passwordExpired': '密码已过期，需要重置密码',
      'lava.error.login.passwordReset': '需要重置密码',
      'lava.error.login.userInactive': '用户未激活',
      'lava.error.login.userNotApproved': '用户审批未通过',
      'lava.error.no.records': '记录不存在',
      'lava.error.register.verifyCode': '验证码错误，请检查后重新输入',
      'lava.error.secretKey.tooMany': '一个用户最多创建两个秘钥',
      'lava.error.user.notFound': '请输入正确的用户名，子用户名@主账号ID，手机号或密码',
      'lava.error.verifyCaptcha.codeIncorrect': '验证码错误，请检查后重新输入',
      'lava.error.verifyCode.expired': '验证码已过期，请重新获取后输入',
    }
  }
}
export const translateErrorMessage = (res: Response<any>, sub = '') => {
  const { t } = useI18n()
  return t(`errors['${res.meta.status_code || ''}']` + (sub ? `.${sub}` : ''))
}