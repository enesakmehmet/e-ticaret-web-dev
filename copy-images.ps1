$ArtifactsDir = "C:\Users\Enes\.gemini\antigravity\brain\e5f86f9c-e737-4600-8a74-885b544a58f3"
$PublicShoesDir = "C:\Users\Enes\Desktop\premium sneaker e-ticaret platformu\public\shoes"

# Copy existing ones
Copy-Item "$ArtifactsDir\yeezy_boost_350_v2_1781445817137.png" -Destination "$PublicShoesDir\shoe-002.png" -Force
Copy-Item "$ArtifactsDir\ultraboost_1_1781445827343.png" -Destination "$PublicShoesDir\shoe-005.png" -Force
Copy-Item "$ArtifactsDir\nmd_r1_1781445839342.png" -Destination "$PublicShoesDir\shoe-008.png" -Force
Copy-Item "$ArtifactsDir\samba_og_1781445851003.png" -Destination "$PublicShoesDir\shoe-012.png" -Force

Copy-Item "$ArtifactsDir\aj1_high_og_1781445868999.png" -Destination "$PublicShoesDir\shoe-000.png" -Force
Copy-Item "$ArtifactsDir\aj4_white_oreo_1781445880821.png" -Destination "$PublicShoesDir\shoe-003.png" -Force
Copy-Item "$ArtifactsDir\aj11_cool_grey_1781445893280.png" -Destination "$PublicShoesDir\shoe-006.png" -Force
Copy-Item "$ArtifactsDir\aj3_black_cement_1781445904043.png" -Destination "$PublicShoesDir\shoe-010.png" -Force
Copy-Item "$ArtifactsDir\aj1_low_travis_1781445912573.png" -Destination "$PublicShoesDir\shoe-014.png" -Force

# Copy new ones
Copy-Item "$ArtifactsDir\aj1_low_dior_1781445932734.png" -Destination "$PublicShoesDir\shoe-015.png" -Force
Copy-Item "$ArtifactsDir\aj4_university_blue_1781445943517.png" -Destination "$PublicShoesDir\shoe-016.png" -Force
Copy-Item "$ArtifactsDir\aj1_high_bred_1781445953437.png" -Destination "$PublicShoesDir\shoe-017.png" -Force
Copy-Item "$ArtifactsDir\aj5_offwhite_black_1781445964621.png" -Destination "$PublicShoesDir\shoe-018.png" -Force

Write-Host "All images copied successfully."
