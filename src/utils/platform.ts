export default function platformCall() {
  const platform = navigator.userAgent;
  const isMac = () => {
    return platform.indexOf('Mac') !== -1;
  };
  const isWin = () => {
    return platform.indexOf('Win') !== -1;
  };
  return {
    isMac: isMac(),
    isWin: isWin()
  };
}
