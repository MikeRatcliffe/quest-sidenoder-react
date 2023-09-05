import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bonelabMods: false,
  chromaticAberration: '1',
  cpuLevel: '-1',
  experimentalMode: false,
  foveationDynamic: false,
  foveationLevel: '2',
  gpuLevel: '-1',
  guardianPause: false,
  mtpMode: true,
  multiplayerName: 'Unknown',
  optimizeFor: 'none',
  presetTetiana: 'none',
  updateFirmwarePath: '',
  videoCaptureBitrate: '5000000',
  videoCaptureFps: '24',
  videoCaptureFullRate: false,
  videoCaptureIn169: false,
  videoCaptureSize: '1024x1024',
  videoRefreshRate: '72',
  videoTextureSize: '1440x1584',
};

export const tweaksSlice = createSlice({
  name: 'tweaks',
  initialState,
  reducers: {
    setTweaksField: (state, action) => {
      const { key, val } = action.payload;

      switch (key) {
        case 'videoCaptureIn169':
          if (val) {
            state.videoCaptureFullRate = true;
            state.videoCaptureSize = '1920x1080';
            state.videoCaptureBitrate = '30000000';
          } else {
            state.videoCaptureFullRate = initialState.videoCaptureFullRate;
            state.videoCaptureSize = initialState.videoCaptureSize;
            state.videoCaptureBitrate = initialState.videoCaptureBitrate;
          }
          break;
        case 'presetTetiana':
          switch (val) {
            case 'full-hd':
              state.videoCaptureSize = '1920x1080';
              state.videoCaptureFps = '60';
              state.videoCaptureBitrate = '10000000';
              break;
            case 'square':
              state.videoCaptureSize = '1600x1600';
              state.videoCaptureFps = '60';
              state.videoCaptureBitrate = '10000000';
              break;
            default:
              state.videoCaptureSize = initialState.videoCaptureSize;
              state.videoCaptureFps = initialState.videoCaptureFps;
              state.videoCaptureBitrate = initialState.videoCaptureBitrate;
              break;
          }
          break;
        case 'optimizeFor':
          switch (val) {
            case 'better-image-quality':
              state.videoRefreshRate = '72';
              state.videoTextureSize = '2048x2253';
              break;
            case '120hz':
              state.videoRefreshRate = '120';
              state.videoTextureSize = '1280x1408';
              state.foveationDynamic = '0';
              state.foveationLevel = '4';
              break;
            default:
              state.videoRefreshRate = initialState.videoRefreshRate;
              state.videoTextureSize = initialState.videoTextureSize;
              state.foveationDynamic = initialState.foveationDynamic;
              state.foveationLevel = initialState.foveationLevel;
          }
          break;
        default:
          state[key] = val;
      }

      // videoCaptureIn169
      state.videoCaptureIn169 =
        state.videoCaptureFullRate &&
        state.videoCaptureSize === '1920x1080' &&
        state.videoCaptureBitrate === '30000000';

      // presetTetiana
      if (
        state.videoCaptureSize === '1920x1080' &&
        state.videoCaptureFps === '60' &&
        state.videoCaptureBitrate === '10000000'
      ) {
        state.presetTetiana = 'full-hd';
      } else if (
        state.videoCaptureSize === '1600x1600' &&
        state.videoCaptureFps === '60' &&
        state.videoCaptureBitrate === '10000000'
      ) {
        state.presetTetiana = 'square';
      } else {
        state.presetTetiana = 'none';
      }

      // optimizeFor
      if (
        state.videoRefreshRate === '72' &&
        state.videoTextureSize === '2048x2253'
      ) {
        state.optimizeFor = 'better-image-quality';
      } else if (
        state.videoRefreshRate === '120' &&
        state.videoTextureSize === '1280x1408' &&
        state.foveationDynamic === '0' &&
        state.foveationLevel === '4'
      ) {
        state.optimizeFor = '120hz';
      } else {
        state.optimizeFor = 'none';
      }
    },
  },
});
export const tweaksFieldsSelector = (state) => state.tweaks;

export const { setTweaksField } = tweaksSlice.actions;
export const tweaksReducer = tweaksSlice.reducer;
