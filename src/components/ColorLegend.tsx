/*
 * Component to display color/ppm legend that allows user to
 * choose between conventional and color-blind schemes.
 * 
 * Callback provides selected function to parent component.
 */

import { useEffect, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";
import { IoEye, IoEyeOutline } from "react-icons/io5";


// Color schems from https://colorbrewer2.org/#type=diverging&scheme=BrBG&n=5
type ColorScheme = [number, number, number][];
//const conventionalScheme: ColorScheme = [[26, 150, 65], [166, 217, 106], [255, 255, 191], [253, 174, 97], [215, 25, 28]];
const conventionalScheme: ColorScheme = [[0, 127, 78], [114, 176, 67], [248, 204, 27], [243, 115, 36], [225, 39, 41]];
const colorBlindScheme: ColorScheme = [[44, 123, 182], [171, 217, 233], [255, 255, 191], [253, 174, 97], [215, 25, 28]];

const thresholds = [600, 800, 1000, 1200]; // Must be sorted. TODO: Pass in as a prop?


function colorFromValue(value: number, scheme: [number, number, number][], thresholds: number[]) {
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


export type ColorFromValueFunction = (value: number) => [number, number, number];
export function defaultColorFromValueFunction(v: number) {
  return colorFromValue(v, conventionalScheme, thresholds);
}
export function colorBlindColorFromValueFunction(v: number) {
  return colorFromValue(v, colorBlindScheme, thresholds);
}
type ColorLegendProps = {
  onSchemeSelection: (selectedFunction: ColorFromValueFunction) => void;
};
const ColorLegend: React.FC<ColorLegendProps> = ({ onSchemeSelection }) => {
  const [isDefault, setIsDefault] = useState(true);

  return (
    <>
      <ToggleSwitch
        initialState={true}
        hoverText="Colorblind"
        onToggle={newState => {
          setIsDefault(newState);
          onSchemeSelection(newState ? defaultColorFromValueFunction : colorBlindColorFromValueFunction);
        }}
        offIcon={<IoEyeOutline className="w-6 h-8 text-gray-700" />}
        onIcon={<IoEye className="w-6 h-8 text-gray-700" />}
        topOffset="16rem"
      />
      <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-60 p-2 rounded shadow-md">
        {/*<h3 className="text-sm font-bold mb-1">CO2 PPM</h3>*/}
        <div className="grid gap-1 items-center">
          {[0, ...thresholds].map((threshold, index) => {
            let label = "";
            if (index === 0) {
              label = "< " + thresholds[0];
            }
            else if (index === thresholds.length) {
              label = "> " + thresholds[thresholds.length - 1]
            }
            else {
              label = `${thresholds[index - 1]} - ${thresholds[index]}`
            }
            return (
              <div key={threshold} className="flex">
                <span
                  className="w-4 h-4 rounded-full border border-black border-solid border-1"
                  style={{ backgroundColor: `rgba(${(isDefault ? defaultColorFromValueFunction : colorBlindColorFromValueFunction)(threshold).join(',')})` }}
                >
                </span>
                <span className="text-xs pl-2 whitespace-nowrap">{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  );
}
export default ColorLegend;