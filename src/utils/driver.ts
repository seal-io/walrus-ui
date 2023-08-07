import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';
import i18n from '@/locale/index';
import { isFunction } from 'lodash';

const options = {
  animate: false,
  allowClose: false,
  doneBtnText: i18n.global.t('common.button.done'), // Text on the final button
  closeBtnText: i18n.global.t('common.button.close'), // Text on the close button for this step
  nextBtnText: i18n.global.t('common.button.next'), // Next button text for this step
  prevBtnText: i18n.global.t('common.button.pre'),
  opacity: 0.3,
  stageBackground: 'rgba(0, 0, 0, .3)'
};
export interface DriverOptions {
  element: string;
  popover: {
    className?: string;
    title: string;
    description: string;
    position?: string;
  };
  onNext?: () => void;
  onPrevious?: () => void;
}
export const initDriver = (steps, { onReset, ...args }) => {
  const driver = new Driver({ ...options, onReset });
  const list = isFunction(steps) ? steps(driver, { ...args }) : steps;
  driver.defineSteps(list);
  return driver;
};

export default {};
