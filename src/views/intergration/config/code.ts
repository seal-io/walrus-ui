export const dependency = ({ name, upstreamUrl, proxyUrl }) => `# pom.xml

<project>    
  ...    
  <distributionManagement>
    <repository>
      <id>seal-proxy-for-${name}</id>
      <name>Seal proxy for deploying snapshot archives to ${upstreamUrl} </name>
      <url>${proxyUrl}</url>
    </repository>
    <snapshotRepository>    
      <id>...</id>
      <name>...</name>
      <url>...</url>
    </snapshotRepository>
  </distributionManagement>
  ...    
</project>`;

export const addCount = ({ proxyName, proxyUrl }) => {
  return `<project xmlns=...>
  ...
  <repositories>
    <repository>
      <id>${proxyName}</id>
      <url>${proxyUrl}</url>
    </repository>
  </repositories>
  ...
</project>`;
};

export const settings = ({ upstreamUrl, proxyUrl }) => `# settings.xml

<settings>
  ...
  <mirrors>
    <mirror>
      <id>seal-proxy-for-central</id>
      <name>Seal proxy URL for ${upstreamUrl}</name>
      <url>${proxyUrl}</url>
      <mirrorOf>central</mirrorOf>
    </mirror>
  </mirrors>
  ...
</settings>`;

export const gradleBuild = (proxyUrl) => {
  return `# build.gradle

  repositories {
    maven {
      url "${proxyUrl}"
    }
  }`;
};

export const gradlePushBuild = (proxyUrl) => {
  return `# build.gradle

  publishing {
    repositories {
      maven {
        def releasesRepoUrl = '${proxyUrl}'
        def snapshotsRepoUrl = '...'
        url = version.endsWith('SNAPSHOT') ? snapshotsRepoUrl : releasesRepoUrl
      }
    }
  }`;
};
export const startP = `$ mvn compile`;

export const updateP = `$ mvn dependency:resolve`;
export default {
  dependency,
};
