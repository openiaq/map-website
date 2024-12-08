/*
 * Component to display color/ppm legend that allows user to
 * choose between conventional and color-blind schemes.
 * 
 * Callback provides selected function to parent component.
 */

import { useEffect, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";
import { IoEye, IoEyeOutline } from "react-icons/io5";



// Color schemes from https://colorbrewer2.org/#type=diverging&scheme=BrBG&n=5
type ColorScheme = [number, number, number][];
//const conventionalScheme: ColorScheme = [[26, 150, 65], [166, 217, 106], [255, 255, 191], [253, 174, 97], [215, 25, 28]];
const conventionalScheme: ColorScheme = [[0, 127, 78], [114, 176, 67], [248, 204, 27], [243, 115, 36], [225, 39, 41]];
const colorBlindScheme: ColorScheme = [[44, 123, 182], [171, 217, 233], [255, 255, 191], [253, 174, 97], [215, 25, 28]];

const THRESHHOLDS = [600, 800, 1000, 1200]; // Must be sorted. TODO: Pass in as a prop?


export function colorFromValue(value: number, isColorBlind: boolean, thresholds: number[] = THRESHHOLDS): [number, number, number] {
  const scheme: [number, number, number][] = isColorBlind ? colorBlindScheme : conventionalScheme;
  if (scheme.length !== thresholds.length + 1) {
    throw new Error("colorFromValue(): length of thresholds must be one less than length of scheme");
  }

  for (let i = 0; i < thresholds.length; i++) {
    if (value < thresholds[i]) {
      return scheme[i];
    }
  }
  return scheme[thresholds.length];
}

type ColorLegendProps = {
  onSchemeSelection: (isColorBlind: boolean) => void;
};

const ColorLegend: React.FC<ColorLegendProps> = ({ onSchemeSelection }) => {
  const [isColorBlind, setIsColorBlind] = useState(false);

  return (
    <div className="absolute bottom-4 right-4">
      <ToggleSwitch
        initialState={false}
        hoverText="Colorblind"
        onToggle={newState => {
          setIsColorBlind(newState);
          onSchemeSelection(newState);
        }}
        offIcon={<IoEyeOutline className="w-4 h-4 text-black" />}
        onIcon={<IoEye className="w-4 h-4 text-black" />}
        size={4}
        className="absolute -top-0 -right-0"
      />
      <div className="bg-gray-900 bg-opacity-70 p-2 rounded shadow-md">
        {/*<h3 className="text-sm font-bold mb-1">CO2 PPM</h3>*/}
        <div className="grid gap-1 items-center">
          {[0, ...THRESHHOLDS].map((threshold, index) => {
            let label = "";
            if (index === 0) {
              label = "< " + THRESHHOLDS[0];
            }
            else if (index === THRESHHOLDS.length) {
              label = "> " + THRESHHOLDS[THRESHHOLDS.length - 1]
            }
            else {
              label = `${THRESHHOLDS[index - 1]} - ${THRESHHOLDS[index]}`
            }
            return (
              <div key={threshold} className="flex">
                <span
                  className="w-4 h-4 rounded-full border border-black border-solid border-1"
                  style={{ backgroundColor: `rgba(${colorFromValue(threshold, isColorBlind, THRESHHOLDS).join(',')})` }}
                >
                </span>
                <span className="text-xs pl-2 whitespace-nowrap">{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
export default ColorLegend;
