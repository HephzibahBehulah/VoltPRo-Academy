# Electronic Components Dataset Creation

## Overview
This dataset was created by collecting component data from Digi-Key, a popular distributor of electronic components. The dataset includes both structured CSV files and corresponding images for various electronic components.

## Data Collection Process

### 1. Downloading CSV Files
To build the dataset, we manually downloaded the CSV files from the Digi-Key website by:
- Navigating to the desired component category.
- Clicking on the **Download Table** option to export the component data.
- Saving the CSV files for further processing.

### 2. Downloading Component Images
The images associated with each component were also retrieved from Digi-Key. The script `DATA.py` was used to automate the downloading and storage of these images in their respective folders.

### 3. Organizing the Dataset
The collected images and CSV data were organized into the following component categories:

- **Capacitors**
  - `Capacitors_aluminum_electrolytic`
  - `mica_and_ptfe_capacitors`
  
- **Semiconductors**
  - `single_bipolar_transistors`
  - `single_diodes`
  
- **Resistors and Inductors**
  - `fixed_inductors`
  - `through_hole_resistors`
  
- **Switches and Potentiometers**
  - `pushbutton_switches`
  - `rocker_switches`
  - `rotary_potentiometers__rheostats`
  - `rotary_switches`
  - `toggle_switches`
  
- **Power Components**
  - `power_supplies__test__bench_`
  - `batteries_non_rechargeable__primary_`
  - `batteries_rechargeable__secondary_`
  - `circuit_breakers`
  - `fuses`
  - `fuseholders`
  
- **Relays and Transformers**
  - `automotive_relays`
  - `isolation_transformers_and_autotransformers__step_up__step_down`
  
- **Motors and Actuators**
  - `motors___ac__dc`
  - `stepper_motors`
  
- **Cables and Connectors**
  - `usb_cables`
  - `video_cables__dvi__hdmi_`
  - `fiber_optic_cables`
  
- **Test and Measurement Equipment**
  - `multimeters`
  - `strain_gauges`
  
- **Optoelectronics**
  - `led_character_and_numeric`
  - `ultrasonic_receivers__transmitters`
  - `solar_cells`
  
- **Instrumentation and Amplifiers**
  - `instrumentation__op_amps__buffer_amps`
  - `analog_multipliers__dividers`
  - `pliers`
  - `tweezers`
  - `wrenches`
  
## Script for Image Downloading
The script `DATA.py` automates the image download process by:
- Extracting image URLs from the CSV files.
- Downloading and saving the images into their respective folders.
- Ensuring proper naming conventions for easy reference.

## Usage
To use this dataset for electronic component recognition, classification, or analysis:
1. Clone the repository.
2. Run `DATA.py` to download missing images (if necessary).
3. Use the CSV files to analyze and process component metadata.


## Acknowledgments
Special thanks to Digi-Key for providing access to component specifications and images.

