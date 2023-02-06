import { PackageURL } from 'packageurl-js';

export default function parsePurl(purl) {
  if (!purl) return null;
  const pkgInfo = PackageURL.fromString(purl);
  return pkgInfo;
}
