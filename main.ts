//% color="#1AC0B3"
namespace leonachu {
    export enum ADCPins {
        //% block="P0"
        P0,
        //% block="P1"
        P1,
        //% block="P2"
        P2
    }

    export enum Lightness {
        //% block="jasny"
        light,
        //% block="ciemny"
        dark
    }

    // global variables and setting default values
    let level = 50 // percents of 1023 (2^10-1)
    let leftPin = ADCPins.P0
    let rightPin = ADCPins.P1

    // analogReadPin() outputs 0..1023
    function readADCPin(pin: ADCPins): number {
        let value = 0
        switch (pin) {
            case ADCPins.P0:
                value = pins.analogReadPin(AnalogPin.P0)
                break
            case ADCPins.P1:
                value = pins.analogReadPin(AnalogPin.P1)
                break
            case ADCPins.P2:
                value = pins.analogReadPin(AnalogPin.P2)
                break
        }
        return ((1023 - value) * 100) / 1023;   // 'negate' the read value and convert to 0...100 range
    }

    // sets IR LED current in range 0..30mA (0..100%)
    function setCurrent(pin: DigitalPin, current: number) {
        let pulses = 32 - pins.map(current, 0, 100, 0, 32)
        pins.digitalWritePin(pin, 0)        // turn off LED, current = 0mA (pulses == 32)
        if (pulses <= 31) {
            control.waitMicros(1100)            // reset LED current to full current (30mA), wait > 1ms, (pulses == 0)
            pins.digitalWritePin(pin, 1)
            control.waitMicros(10)
            for (let i = 1; i <= pulses; i++) { // current[%] = 100% - pulses * 100%/32 (1 pulse -> 96,67% * 30mA, 31 pulses -> 1,67% * 30mA)
                pins.digitalWritePin(pin, 0)
                control.waitMicros(10)
                pins.digitalWritePin(pin, 1)
                control.waitMicros(10)
            }
        }
    }

    //% blockId=leonachu_set_level
    //% block="ustaw próg na %value procent"
    //% value.min=0 value.max=100
    //% value.defl=50
    //% weight=100 blockGap=8
    export function setLevel(value: number) {
        if (value > 100)
            value = 100
        if (value < 0)
            value = 0
        level = value
    }

    function checkLightness (pin: ADCPins, light: Lightness): boolean {
        switch (light) {
            case Lightness.light:
                if (readADCPin(pin) >= level) {
                    return true
                } else {
                    return false
                }
                break
            case Lightness.dark:
                if (readADCPin(pin) <= level) {
                    return true
                } else {
                    return false
                }
                break
        }
    }

    //% blockId=leonachu_set_left_sensor_parameters
    //% block="lewy na %photoPin LED na %ctrlPin z mocą %current procent"
    //% current.min=0 current.max=100
    //% current.defl=100
    //% weight=95 blockGap=8
    export function setLeft(photoPin: ADCPins, ctrlPin: DigitalPin, current: number) {
        leftPin = photoPin
        setCurrent(ctrlPin, current)
    }

    //% blockId=leonachu_set_right_sensor_parameters
    //% block="prawy na %photoPin LED na %ctrlPin z mocą %current procent"
    //% current.min=0 current.max=100
    //% current.defl=100
    //% weight=90 blockGap=8
    export function setRight(photoPin: ADCPins, ctrlPin: DigitalPin, current: number) {
        rightPin = photoPin
        setCurrent(ctrlPin, current)
    }

    //% blockId=leonachu_sensor_read_left
    //% block="lewy"
    //% weight=85 blockGap=8
    export function readLeft(): number {
        return readADCPin(leftPin)
    }

    //% blockId=leonachu_sensor_read_right
    //% block="prawy"
    //% weight=80 blockGap=8
    export function readRight(): number {
        return readADCPin(rightPin)
    }

    //% blockId=leonachu_left_lightness
    //% block="lewy widzi %light"
    //% weight=75 blockGap=8
    export function leftLightness(light: Lightness): boolean {
        return checkLightness(leftPin, light)
    }

    //% blockId=leonachu_right_lightness
    //% block="prawy widzi %light"
    //% weight=70 blockGap=8
    export function rightLightness(light: Lightness): boolean {
        return checkLightness(rightPin, light)
    }
}