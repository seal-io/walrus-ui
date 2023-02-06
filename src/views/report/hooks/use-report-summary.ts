import { reactive, ref } from 'vue';
import { getEventReport } from '../api/report';

export default async function useReportSummary({ id, dismissed }) {
  let violationSummary = reactive({});
  const loadend = ref(false);
  const fetchData = async () => {
    const obj = {
      dismissed: dismissed === 'all' ? undefined : dismissed,
    };
    const params = {
      id,
      ...obj,
    };
    try {
      loadend.value = false;
      const { data } = await getEventReport(params);
      const info = data?.violationSummary || {};
      violationSummary = Object.assign(violationSummary, info);
      loadend.value = true;
    } catch (error) {
      console.log(error);
      loadend.value = true;
    }
  };
  await fetchData();
  return {
    violationSummary,
    loadend: loadend.value,
  };
}
