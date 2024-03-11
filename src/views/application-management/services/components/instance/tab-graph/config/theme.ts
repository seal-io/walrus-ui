import { nodeKindType } from './index';

const black1 = '33, 36, 39';
const black2 = '21, 21, 21';
const black3 = '52, 62, 76';

export const lightStateStyles = {
  normal: {
    inactive: {
      fill: 'rgba(255,255,255,.5)'
    },
    selected: {
      stroke: 'rgb(33, 74, 196)',
      lineWidth: 1
    },
    hover: {
      stroke: 'rgb(33, 74, 196)',
      lineWidth: 1
    }
  },
  [nodeKindType.ServiceResourceGroup]: {
    drifted: {
      inactive: {
        fill: 'rgba(247, 186, 30,.2)'
      },
      highlight: {
        fill: 'rgba(247, 186, 30,.7)'
      },
      selected: {
        stroke: 'rgba(247, 186, 30,.8)',
        lineWidth: 1
      },
      hover: {
        stroke: 'rgba(247, 186, 30,.8)',
        lineWidth: 1
      }
    },
    default: {
      inactive: {
        fill: 'rgba(232,242,255,.5)'
      },
      highlight: {
        fill: 'rgba(142, 173, 231,.7)'
      },
      selected: {
        stroke: 'rgb(33, 74, 196)',
        lineWidth: 1
      },
      hover: {
        stroke: 'rgb(33, 74, 196)',
        lineWidth: 1
      }
    }
  }
};

export const darkStateStyles = {
  normal: {
    inactive: {
      fill: 'rgba(52,62,76, .5)',
      shadowColor: 'transparent'
    },
    selected: {
      stroke: 'rgba(255,255,255, .7)',
      fill: `rgba(${black2}, 1)`,
      lineWidth: 1
    },
    highlight: {
      stroke: 'rgba(255,255,255, 0)',
      fill: `rgba(${black2}, 1)`,
      lineWidth: 1
    },
    hover: {
      stroke: 'rgba(186,186,186, 0.7)',
      fill: `rgba(${black2}, 1)`,
      lineWidth: 1
    }
  },
  [nodeKindType.ServiceResourceGroup]: {
    drifted: {
      inactive: {
        fill: 'rgba(247, 186, 30,.2)',
        shadowColor: 'transparent'
      },
      highlight: {
        fill: 'rgba(142, 173, 231,.7)'
      },
      selected: {
        stroke: 'rgba(247, 186, 30,.8)',
        lineWidth: 1
      },
      hover: {
        stroke: 'rgba(247, 186, 30,.8)',
        lineWidth: 1
      }
    },
    default: {
      inactive: {
        fill: 'rgba(81,115,153,0.3)',
        stroke: 'rgba(255,255,255, 0)',
        shadowColor: 'transparent'
      },
      highlight: {
        fill: 'rgba(81,115,153,1)'
      },
      selected: {
        stroke: 'rgba(255,255,255, .7)',
        fill: `rgba(${black2}, 1)`,
        lineWidth: 1
      },
      hover: {
        stroke: 'rgba(186,186,186, 0.7)',
        fill: `rgba(${black2}, 1)`,
        lineWidth: 1
      }
    }
  }
};

export const nodeStateStyles = {
  light: lightStateStyles,
  dark: darkStateStyles
};

export const driftedNodeStyle = {
  light: {
    drifted: {
      fill: 'rgba(247, 186, 30,.5)'
    },
    default: {
      fill: '#e8f2ff'
    }
  },
  dark: {
    drifted: {
      fill: 'lightyellow'
    },
    default: {
      fill: 'rgba(35, 42, 52,.9)'
    }
  }
};

export const defaultNodeStyle = {
  dark: {
    labelCfg: {
      style: {
        fill: 'rgba(255,255,255,.7)',
        shadowColor: 'rgba(169,174,184,60%)'
      }
    },
    descriptionCfg: {
      style: {
        fill: 'rgba(255,255,255,.5)'
      }
    },
    style: {
      fill: 'rgba(52,62,76, 1)'
    }
  },
  light: {
    labelCfg: {
      style: {
        fill: 'rgba(33,36,39,1)',
        shadowColor: 'rgba(169,174,184,60%)'
      }
    },
    descriptionCfg: {
      style: {
        fill: 'rgb(134,144,156)'
      }
    },
    style: {
      fill: 'rgba(255,255,255, 1)'
    }
  }
};
export default {};
