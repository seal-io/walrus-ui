import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
