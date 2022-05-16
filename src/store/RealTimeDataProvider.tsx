import * as React from 'react';
import { RealTimeDataContext } from './RealTimeDataContext';
import { generateTimeSeriesData } from '../utils/generateTimeSeriesData';
import { Props, IState } from './types';

const initialState: IState = {
  threshold: 10,
  realTimeData: new Array(50).fill(0),
  signalData: new Array(50).fill(0),
};

//Enums allow a developer to define a set of named constants
enum ACTIONS_ENUM {
  SET_THRESHOLD = 'SET_THRESHOLD',
  SET_REAL_TIME_DATA = 'SET_REAL_TIME_DATA',
  SET_SIGNAL_DATA = 'SET_SIGNAL_DATA',
}

type ACTION_TYPES =
  | { type: ACTIONS_ENUM.SET_THRESHOLD; payload: number }
  | { type: ACTIONS_ENUM.SET_REAL_TIME_DATA }
  | { type: ACTIONS_ENUM.SET_SIGNAL_DATA }

const reducer = (
  state: IState = initialState,
  action: ACTION_TYPES
): IState => {
  switch (action.type) {
    case ACTIONS_ENUM.SET_THRESHOLD:
      return {
        ...state,
        threshold: action.payload,
      };
    case ACTIONS_ENUM.SET_REAL_TIME_DATA:
      return {
        ...state,
        realTimeData: generateTimeSeriesData(15, 1),
      };
    case ACTIONS_ENUM.SET_SIGNAL_DATA:
      return {
        ...state,
        signalData: state.realTimeData.map((a: number) =>
          a > state.threshold ? 1 : 0
        ),
      };
    default:
      return state;
  }
};

const RealTimeDataProvider: React.FC<Props> = ({ children }) => {
  // const [realTimeData, setRealTimeData] = React.useState<number[]>([]);
  // const [signal, setSignal] = React.useState<number[]>([]);
  // const [threshold, setThreshold] = React.useState<number>(10);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    const newDataSetGeneratedAtIntervals = setInterval(() => {
      dispatch({ type: ACTIONS_ENUM.SET_REAL_TIME_DATA });
    }, 3000);
    return () => clearInterval(newDataSetGeneratedAtIntervals);
  }, []);

  React.useEffect(() => {
    dispatch({
      type: ACTIONS_ENUM.SET_SIGNAL_DATA,
    });
  }, [state.realTimeData]);

  const value = {
    setThreshold: (threshold: number) => {
      dispatch({ type: ACTIONS_ENUM.SET_THRESHOLD, payload: threshold });
    },
    state,
  };

  // React.useEffect(() => {
  //   const newDataSetGeneratedAtIntervals = setInterval(() => {
  //     const dataSet = generateTimeSeriesData(15, 1);
  //     setRealTimeData(dataSet);
  //   }, 3000);
  //   return () => clearInterval(newDataSetGeneratedAtIntervals);
  // }, []);

  // React.useEffect(() => {
  //   handleGenerateSignalData(realTimeData, threshold);
  // }, [realTimeData, threshold])

  // const handleGenerateSignalData = (actualData:number[], threshold:number): void => {
  //   const signalData = actualData.map((a) => (a > threshold ? 1 : 0));
  //   setSignal(signalData);
  // };

  return (
    <RealTimeDataContext.Provider
      // value={{ signal, setThreshold, realTimeData, threshold }}
      value={value}>
      {children}
    </RealTimeDataContext.Provider>
  );
};

export default RealTimeDataProvider;
