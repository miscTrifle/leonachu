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
    let level = 50 // percents of 2^10-1
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

    //% blockId=leonachu_set_left_pin
    //% block="lewy na %pin"
    //% weight=95 blockGap=8
    export function chooseLeft(pin: ADCPins) {
        leftPin = pin
    }

    //% blockId=leonachu_set_right_pin
    //% block="prawy na %pin"
    //% weight=90 blockGap=8
    export function chooseRight(pin: ADCPins) {
        rightPin = pin
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