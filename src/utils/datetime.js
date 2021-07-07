import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

function datetimeFormat(datetime = new Date(), pattern = 'YYYY-MM-DD HH:mm') {
    return dayjs(datetime).format(pattern)
}

export {datetimeFormat}
