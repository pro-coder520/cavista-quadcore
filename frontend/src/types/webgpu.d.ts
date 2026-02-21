/**
 * WebGPU type declarations for navigator.gpu
 */

export { };

declare global {
    interface GPU {
        requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>;
    }

    interface GPURequestAdapterOptions {
        powerPreference?: "low-power" | "high-performance";
    }

    interface GPUAdapter {
        readonly name: string;
        requestDevice(descriptor?: GPUDeviceDescriptor): Promise<GPUDevice>;
    }

    interface GPUDeviceDescriptor {
        label?: string;
    }

    interface GPUDevice {
        readonly label: string;
    }

    interface Navigator {
        readonly gpu: GPU | undefined;
    }
}
