import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import { holocardVert, holocardFrag } from "./shaders";

// --- HOLOGRAFİK KART SHADER MATERYALİ ---
export const HoloCardMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: new THREE.Texture(),
    uOpacity: 1,
    uActive: 0, // 0 = normal, 1 = aktif/seçili
  },
  holocardVert,
  holocardFrag
);

// R3F'in <holoCardMaterial />'i tanıması için genişlet
extend({ HoloCardMaterial });

// Özel eleman için TypeScript tanımını ekle
declare module "@react-three/fiber" {
  interface ThreeElements {
    holoCardMaterial: ThreeElement<typeof HoloCardMaterial>;
  }
}
