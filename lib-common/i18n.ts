// 使用BCP-47语言标识规范 https://juejin.cn/post/6844903863556767758
// 常用地区见 https://www.techonthenet.com/js/language_tags.php
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
      // 'lava.error.db.canNotSetSchema': '当前 schema 已不存在，请检查后重新选择schema',
      'lava.error.worksheetHistoryNotExist': '很遗憾！您的执行历史已被删除，请刷新列表',
      'lava.error.worksheetSqlNotExist': '很遗憾！您的版本历史已被删除，请稍后再试',
      'lava.error.worksheetNotExist': '很遗憾！当前工作簿（工作簿名）已被删除。',
      'lava.error.worksheetNameNotFormat': '请填写正确的50位字符以内不包涵<,>,/,|,*,,的名称',
      'lava.error.worksheetNameAlreadyExist': '您填写的工作簿名已存在，请检查后重新填写',
      'lava.error.worksheetFolderNotExist': '很遗憾！当前文件夹（文件夹名）已被删除。',
      'lava.error.worksheetFolderNameNotFormat': '请填写正确的50位字符以内不包涵<,>,/,|,*,,的名称',
      'lava.error.worksheetFolderNameAlreadyExist': '您填写的文件夹名已存在，请检查后重新填写',
      'lava.error.loadTaskNotExist': '很遗憾！当前传输任务（传输任务名）已被删除。',
      'lava.error.loadTaskNotInLoading': '很遗憾！传输任务取消失败。',
      'lava.error.loadTaskNameAlreadyExist': '您填写的传输任务名已存在，请检查后重新填写',
      'lava.error.db.canNotConnectToOushuDB': '很遗憾！连接OushuDB实例失败，请稍后刷新页面重试',
      'lava.error.db.canNotFindPid': '很遗憾！获取SQL进程失败，请稍后刷新页面重试',
      'lava.error.db.canNotSetResourceQueue': '很遗憾！配置命名空间失败，请稍后刷新页面重试',
      'lava.error.db.canNotSetSchema': '很遗憾！配置命名空间失败，请稍后刷新页面重试',
      'lava.error.cos.canNotGetTempCredential': '很遗憾！获取临时令牌失败，请稍后刷新页面重试',
      'lava.error.cos.canNotCompressFiles': '很遗憾！获取压缩文件失败，请稍后刷新页面重试',
    }
  }
}
/**
 * 基于response获取错误信息的辅助函数
 * @param {(pattern: string) => string} t 当前i18n实例的translate函数
 * @returns {(Response<any>, string) => string} 可以基于Response返回errormessage的函数
 */
export const translateErrorMessage = (t: (pattern: string) => string) => {
  /**
   * @param {Response<any>} res http请求response参数
   * @param {string?} sub 可选，当该错误有多种可选message时，传入key使用对应的message，如master
   * @returns {string} 返回message
   */
  return (res: Response<any>, sub = ''): string => {
    return t(`errors['${res.meta.status_code || ''}']` + (sub ? `.${sub}` : ''))
  }
}
