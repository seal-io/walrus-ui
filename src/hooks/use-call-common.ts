import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import useLoading from '@/hooks/loading';

export default function useCallCommon() {
  const { t, locale } = useI18n();
  const route = useRoute();
  const router = useRouter();
  const { loading, setLoading } = useLoading(true);
  return {
    t,
    locale,
    route,
    router,
    loading,
    setLoading
  };
}
