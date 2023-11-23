import { MoreAction } from '@/views/config/interface';
import { useUserStore } from '@/store';

const builtinCatalog = 'https://catalog.seal.io/walrus-catalog';
const builtinCatalogName = 'builtin';

const userStore = useUserStore();

export const actionList: MoreAction[] = [
  {
    label: 'common.button.edit',
    value: 'edit',
    icon: 'icon-edit',
    status: 'normal'
  },
  {
    label: 'common.button.refresh',
    value: 'refresh',
    icon: 'icon-refresh',
    status: 'normal'
  },
  {
    label: 'common.button.delete',
    value: 'delete',
    icon: 'icon-delete',
    status: 'danger',
    filterFun(currentInfo) {
      const flag =
        userStore.userSetting?.EnableBuiltinCatalog?.value === 'true' &&
        currentInfo.source === builtinCatalog &&
        currentInfo.name === builtinCatalogName;
      return !flag;
    }
  }
];
export default {};
