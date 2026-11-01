export const faqSvgMarkup = String.raw`<svg
id="dc-faq-svg"
class="dc-faq-svg"
viewBox="0 0 650 740"
fill="none"
xmlns="http://www.w3.org/2000/svg"
role="img"
aria-label="Frequently Asked Questions board with a curious peeking cat on top and a playful cat with a ball of yarn below"
>
<defs>
<!-- Subtle hand-drawn organic roughening filter for authentic ink feel -->
<filter id="hand-drawn-ink" x="-5%" y="-5%" width="110%" height="110%">
<feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" result="noise" />
<feDisplacementMap in="SourceGraphic" in2="noise" scale="1.15" xChannelSelector="R" yChannelSelector="G" />
</filter>
<!-- Clip path for inside of the yarn ball -->
<clipPath id="yarn-clip">
<circle cx="0" cy="0" r="35" />
</clipPath>
</defs>
<!--=========================================================================
1. SIDE ANNOTATION ("SAME CURIOSITY. BIGGER IDEAS." + ARROW)
========================================================================= -->
<!-- Side annotation is painted last to stay in front of the board. -->
<!-- Hand-drawn curved arrow pointing to the board -->
<path
d="M 78 432 C 54 429, 44 405, 48 377"
stroke="#111111"
stroke-width="2.4"
stroke-linecap="round"
fill="none"
/>
<path
d="M 41 385 L 48 375 L 55 384"
stroke="#111111"
stroke-width="2.4"
stroke-linecap="round"
stroke-linejoin="round"
fill="none"
/>
<!--=========================================================================
2. ROTATED BOARD GROUP (Includes Peeking Cat + FAQ Board)
========================================================================= -->
<g id="board-tilted-group" transform="rotate(-5.5 335 365)">
<!-- -----------------------------------------------------------------------
2A. PEEKING CAT (BEHIND TOP EDGE OF BOARD)
----------------------------------------------------------------------- -->
<g id="peek-cat-root" transform="translate(285, 162)">
<!-- Comic radiating excitement lines around Peeking Cat -->
<g id="peek-action-ticks" class="action-ticks">
<!-- Left ticks -->
<line x1="-108" y1="-34" x2="-92" y2="-22" stroke="#111111" stroke-width="3" stroke-linecap="round" />
<line x1="-88" y1="-78" x2="-74" y2="-63" stroke="#111111" stroke-width="3" stroke-linecap="round" />
<line x1="-68" y1="-94" x2="-58" y2="-74" stroke="#111111" stroke-width="3" stroke-linecap="round" />
<!-- Right ticks near tail -->
<line x1="108" y1="-68" x2="122" y2="-84" stroke="#111111" stroke-width="3" stroke-linecap="round" />
<line x1="115" y1="-48" x2="132" y2="-56" stroke="#111111" stroke-width="3" stroke-linecap="round" />
</g>
<!-- Peeking Cat Tail (curls up behind the right side) -->
<g id="peek-tail-pivot" transform="translate(68, 4)">
<path
class="cat-body-fill"
d="M 0 12 C 18 6, 36 -12, 34 -34 C 32 -54, 10 -62, 2 -50 C -5 -40, 8 -30, 14 -24 C 19 -18, 12 2, -4 8 Z"
fill="#111111"
stroke="#111111"
stroke-width="2.5"
stroke-linejoin="round"
/>
</g>
<!-- Peeking Cat Head & Ears Group (tracks pointer) -->
<g id="peek-head-group" transform="translate(0, 0)">
<!-- Left Ear -->
<g id="peek-ear-l" transform="translate(-40, -52)">
<path
class="cat-body-fill"
d="M -18 16 C -26 -10, -22 -34, -10 -36 C 2 -38, 16 -18, 22 -2 Z"
fill="#111111"
stroke="#111111"
stroke-width="2.5"
stroke-linejoin="round"
/>
<path
class="cat-ear-inner"
d="M -10 4 C -15 -10, -13 -22, -7 -23 C -1 -24, 7 -11, 10 0 Z"
fill="#ffffff"
/>
</g>
<!-- Right Ear -->
<g id="peek-ear-r" transform="translate(38, -54)">
<path
class="cat-body-fill"
d="M -20 -4 C -12 -24, 2 -42, 14 -39 C 26 -36, 26 -10, 18 18 Z"
fill="#111111"
stroke="#111111"
stroke-width="2.5"
stroke-linejoin="round"
/>
<path
class="cat-ear-inner"
d="M -9 -2 C -4 -14, 4 -26, 10 -24 C 16 -22, 15 -8, 10 6 Z"
fill="#ffffff"
/>
</g>
<!-- Head Dome & Crown Fur Tuft -->
<path
class="cat-body-fill"
d="M -58 12
C -62 -38, -38 -66, -8 -68
L -4 -77 L 2 -69 L 10 -78 L 13 -68
C 40 -65, 62 -38, 58 12 Z"
fill="#111111"
stroke="#111111"
stroke-width="2.5"
stroke-linejoin="round"
/>
<!-- Whiskers (Left & Right) -->
<g class="cat-whiskers">
<!-- Left Whiskers -->
<path d="M -52 -20 Q -72 -26 -86 -24" stroke="#111111" stroke-width="2.3" stroke-linecap="round" />
<path d="M -54 -13 Q -74 -15 -89 -10" stroke="#111111" stroke-width="2.3" stroke-linecap="round" />
<path d="M -42 -18 L -55 -21" stroke="#ffffff" stroke-width="2" stroke-linecap="round" class="cat-inner-detail" />
<path d="M -44 -12 L -56 -13" stroke="#ffffff" stroke-width="2" stroke-linecap="round" class="cat-inner-detail" />
<!-- Right Whiskers -->
<path d="M 52 -22 Q 72 -30 86 -27" stroke="#111111" stroke-width="2.3" stroke-linecap="round" />
<path d="M 54 -15 Q 74 -19 88 -14" stroke="#111111" stroke-width="2.3" stroke-linecap="round" />
<path d="M 42 -20 L 55 -23" stroke="#ffffff" stroke-width="2" stroke-linecap="round" class="cat-inner-detail" />
<path d="M 44 -14 L 56 -16" stroke="#ffffff" stroke-width="2" stroke-linecap="round" class="cat-inner-detail" />
</g>
<!-- Eyes Group (scales Y for blinking) -->
<g id="peek-eyes-blink" transform="translate(0, -25)">
<!-- Left Eye -->
<g transform="translate(-25, 0)">
<circle cx="0" cy="0" r="14.5" fill="#ffffff" stroke="#111111" stroke-width="2.5" />
<circle id="peek-pupil-l" cx="3.5" cy="-1" r="9.5" fill="#111111" />
</g>
<!-- Right Eye -->
<g transform="translate(25, -1)">
<circle cx="0" cy="0" r="14.5" fill="#ffffff" stroke="#111111" stroke-width="2.5" />
<circle id="peek-pupil-r" cx="3.5" cy="-1" r="9.5" fill="#111111" />
</g>
</g>
<!-- Cute Nose & 'w' Mouth -->
<g transform="translate(0, -12)">
<polygon class="cat-nose-fill" points="-4,-3 4,-3 0,1.5" fill="#ffffff" />
<path
class="cat-inner-detail"
d="M -7 3 Q -3.5 8 0 2.5 Q 3.5 8 7 3"
stroke="#ffffff"
stroke-width="2.3"
stroke-linecap="round"
fill="none"
/>
</g>
<!-- Hitbox for clicking/tapping Peeking Cat -->
<rect id="peek-cat-hitbox" class="cat-hitbox" x="-85" y="-90" width="170" height="115" rx="20" />
</g>
</g>
<!-- -----------------------------------------------------------------------
2B. THE FAQ BOARD CARD (Opaque White - Masks Ducked Cat Naturally)
----------------------------------------------------------------------- -->
<g id="faq-board-card">
<!-- Outer Board Frame -->
<rect
x="110"
y="162"
width="450"
height="425"
rx="10"
fill="#ffffff"
stroke="#111111"
stroke-width="4.2"
stroke-linejoin="round"
/>
<!-- Inner Board Frame -->
<rect
x="125"
y="177"
width="420"
height="395"
rx="4"
fill="#ffffff"
stroke="#111111"
stroke-width="2.3"
stroke-linejoin="round"
/>
<!-- Inner Corner Registration Ticks -->
<path d="M 137 195 L 137 188 L 144 188" stroke="#111111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
<path d="M 526 188 L 533 188 L 533 195" stroke="#111111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
<path d="M 526 558 L 533 558 L 533 551" stroke="#111111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
<!-- Board Display Heading -->
<text x="150" y="274" class="board-title">Frequently</text>
<text x="150" y="340" class="board-title">Asked</text>
<text x="150" y="406" class="board-title board-title-muted">Questions.</text>
<!-- Hand-drawn Lightbulb Doodle -->
<g id="lightbulb-doodle" transform="translate(476, 326) rotate(12)">
<!-- Bulb glass -->
<path
d="M -12 8 C -17 0, -18 -14, -9 -21 C 0 -28, 13 -24, 16 -13 C 19 -3, 13 4, 9 10 L -9 10 Z"
fill="#ffffff"
stroke="#111111"
stroke-width="2.3"
stroke-linejoin="round"
/>
<!-- Inner filament -->
<path
d="M -4 9 L -4 -3 C -4 -8, 4 -8, 4 -3 L 4 9"
stroke="#111111"
stroke-width="1.9"
stroke-linecap="round"
/>
<!-- Screw base -->
<rect x="-7" y="10" width="14" height="4.5" rx="2" fill="#ffffff" stroke="#111111" stroke-width="2.1" />
<rect x="-5.5" y="14.5" width="11" height="4" rx="2" fill="#ffffff" stroke="#111111" stroke-width="2.1" />
<path d="M -3 19 C -2 22, 2 22, 3 19" fill="#111111" stroke="#111111" stroke-width="2" />
<!-- Glow rays -->
<line x1="0" y1="-30" x2="0" y2="-36" stroke="#111111" stroke-width="2.1" stroke-linecap="round" />
<line x1="17" y1="-24" x2="22" y2="-29" stroke="#111111" stroke-width="2.1" stroke-linecap="round" />
<line x1="23" y1="-8" x2="29" y2="-8" stroke="#111111" stroke-width="2.1" stroke-linecap="round" />
<line x1="18" y1="7" x2="23" y2="11" stroke="#111111" stroke-width="2.1" stroke-linecap="round" />
<line x1="-17" y1="-24" x2="-22" y2="-29" stroke="#111111" stroke-width="2.1" stroke-linecap="round" />
<line x1="-23" y1="-8" x2="-29" y2="-8" stroke="#111111" stroke-width="2.1" stroke-linecap="round" />
<line x1="-18" y1="7" x2="-23" y2="11" stroke="#111111" stroke-width="2.1" stroke-linecap="round" />
</g>
<!-- Bottom-left Handwritten Subtext -->
<g transform="translate(156, 476) rotate(-3)">
<text x="0" y="0" class="hand-note">ALL YOUR DOUBTS,</text>
<text x="0" y="28" class="hand-note">IN ONE PLACE.</text>
<path
d="M 2 38 Q 78 34 152 37"
stroke="#111111"
stroke-width="2.8"
stroke-linecap="round"
fill="none"
/>
</g>
</g>
<!-- -----------------------------------------------------------------------
2C. PEEKING CAT PAWS (Overlapping in front of the top border)
----------------------------------------------------------------------- -->
<g id="peek-paws-front" transform="translate(285, 162)">
<!-- Subtle chin curve overlapping border when fully up -->
<path
id="peek-chin-overlap"
class="cat-body-fill"
d="M -38 -1 Q 0 6 38 -1"
stroke="#111111"
stroke-width="5"
stroke-linecap="round"
fill="none"
/>
<!-- Left Gripping Paw -->
<g id="peek-paw-l" transform="translate(-58, 3)">
<ellipse class="cat-body-fill" cx="0" cy="0" rx="20" ry="14" fill="#111111" stroke="#111111" stroke-width="2.5" />
<path class="cat-inner-detail" d="M -8 -3 C -9 3, -8 8, -7 10" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" />
<path class="cat-inner-detail" d="M 0 -4 C 0 3, 0 8, 0 11" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" />
<path class="cat-inner-detail" d="M 8 -3 C 9 3, 8 8, 7 10" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" />
</g>
<!-- Right Gripping Paw -->
<g id="peek-paw-r" transform="translate(58, 3)">
<ellipse class="cat-body-fill" cx="0" cy="0" rx="20" ry="14" fill="#111111" stroke="#111111" stroke-width="2.5" />
<path class="cat-inner-detail" d="M -8 -3 C -9 3, -8 8, -7 10" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" />
<path class="cat-inner-detail" d="M 0 -4 C 0 3, 0 8, 0 11" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" />
<path class="cat-inner-detail" d="M 8 -3 C 9 3, 8 8, 7 10" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" />
</g>
</g>
</g>
<!--=========================================================================
3. FLOOR SCENE (Floor Sketch Lines + Floor Cat + Ball of Yarn)
========================================================================= -->
<g id="floor-scene">
<!-- Hand-drawn Floor Sketch Lines -->
<g id="floor-ground-lines" stroke="#111111" stroke-width="2.2" stroke-linecap="round">
<line x1="56" y1="642" x2="88" y2="642" />
<line x1="74" y1="650" x2="112" y2="650" />
<line x1="94" y1="658" x2="128" y2="658" />
<line x1="120" y1="666" x2="210" y2="666" />
<line x1="158" y1="674" x2="205" y2="674" />
<line x1="398" y1="664" x2="452" y2="664" />
<line x1="382" y1="673" x2="438" y2="673" />
</g>
<!-- -----------------------------------------------------------------------
3A. FLOOR CAT
----------------------------------------------------------------------- -->
<g id="floor-cat-root">
<!-- Motion ticks near tail & head -->
<g id="floor-action-ticks" class="action-ticks">
<!-- Tail ticks (left) -->
<line x1="60" y1="536" x2="72" y2="548" stroke="#111111" stroke-width="2.8" stroke-linecap="round" />
<line x1="72" y1="526" x2="82" y2="542" stroke="#111111" stroke-width="2.8" stroke-linecap="round" />
<line x1="88" y1="523" x2="92" y2="540" stroke="#111111" stroke-width="2.8" stroke-linecap="round" />
<!-- Right side ticks -->
<line x1="444" y1="572" x2="454" y2="556" stroke="#111111" stroke-width="2.8" stroke-linecap="round" />
<line x1="456" y1="582" x2="469" y2="572" stroke="#111111" stroke-width="2.8" stroke-linecap="round" />
</g>
<!-- Floor Cat S-Curved Tail (Pivot at hip) -->
<g id="floor-tail-pivot" transform="translate(152, 636)">
<path
class="cat-body-fill"
d="M 0 0
C -36 4, -68 -14, -72 -52
C -75 -76, -64 -96, -46 -94
C -30 -92, -28 -72, -38 -62
C -46 -54, -44 -34, -26 -24
C -14 -17, -2 -16, 8 -14 Z"
fill="#111111"
stroke="#111111"
stroke-width="2.5"
stroke-linejoin="round"
/>
</g>
<!-- Floor Cat Torso & Hind Legs (Pivot at lower back) -->
<g id="floor-body-pivot" transform="translate(222, 626)">
<!-- Main Plump Belly & Back -->
<path
class="cat-body-fill"
d="M -82 14
C -92 -8, -74 -44, -42 -46
C -16 -48, 8 -34, 44 -34
C 72 -34, 92 -12, 86 16
C 78 32, -58 34, -82 14 Z"
fill="#111111"
stroke="#111111"
stroke-width="2.5"
stroke-linejoin="round"
/>
<!-- Tucked Left Hind Foot (with cute white toe beans) -->
<g id="floor-hind-foot-l" transform="translate(-44, -46)">
<path
class="cat-body-fill"
d="M -18 14 C -24 -4, -10 -18, 8 -14 C 22 -10, 22 6, 14 18 Z"
fill="#111111"
stroke="#111111"
stroke-width="2.5"
/>
<circle cx="-6" cy="-6" r="2.8" fill="#ffffff" />
<circle cx="2" cy="-8" r="2.8" fill="#ffffff" />
<circle cx="10" cy="-5" r="2.8" fill="#ffffff" />
<ellipse cx="2" cy="1" rx="5.5" ry="3.5" fill="#ffffff" />
</g>
<!-- Raised Playful Right Hind Leg (stretches & wiggles) -->
<g id="floor-hind-leg-r" transform="translate(2, -34)">
<path
class="cat-body-fill"
d="M -14 8
C -2 -12, 16 -36, 32 -52
C 44 -64, 64 -54, 58 -36
C 52 -18, 28 2, 12 18 Z"
fill="#111111"
stroke="#111111"
stroke-width="2.5"
stroke-linejoin="round"
/>
<!-- Toe beans on raised hind paw -->
<circle cx="38" cy="-49" r="3" fill="#ffffff" />
<circle cx="46" cy="-47" r="3" fill="#ffffff" />
<circle cx="51" cy="-39" r="3" fill="#ffffff" />
<ellipse cx="41" cy="-38" rx="5.5" ry="4" transform="rotate(32 41 -38)" fill="#ffffff" />
</g>
</g>
<!-- Floor Cat Tilted Head Group (Pivot at neck: tracks pointer & yarn) -->
<g id="floor-head-group" transform="translate(362, 616)">
<!-- Little action tick near forehead -->
<line x1="-22" y1="-68" x2="-18" y2="-54" stroke="#111111" stroke-width="2.5" stroke-linecap="round" />
<!-- Upper/Left Ear -->
<g id="floor-ear-l" transform="translate(4, -46)">
<path
class="cat-body-fill"
d="M -22 6 C -14 -16, 4 -36, 16 -33 C 28 -30, 26 -2, 16 20 Z"
fill="#111111"
stroke="#111111"
stroke-width="2.5"
stroke-linejoin="round"
/>
<path
class="cat-ear-inner"
d="M -9 4 C -3 -10, 6 -21, 12 -19 C 18 -17, 16 -2, 10 10 Z"
fill="#ffffff"
/>
</g>
<!-- Lower/Right Ear -->
<g id="floor-ear-r" transform="translate(44, -8)">
<path
class="cat-body-fill"
d="M -10 -20 C 12 -18, 34 -6, 35 6 C 36 18, 12 28, -16 22 Z"
fill="#111111"
stroke="#111111"
stroke-width="2.5"
stroke-linejoin="round"
/>
<path
class="cat-ear-inner"
d="M -4 -10 C 10 -9, 22 -2, 22 4 C 22 10, 8 15, -8 12 Z"
fill="#ffffff"
/>
</g>
<!-- Tilted Round Cat Head Shape -->
<path
class="cat-body-fill"
d="M -54 -6
C -52 -44, -14 -58, 18 -46
C 50 -34, 62 4, 46 34
C 32 54, -18 54, -44 34
C -56 24, -56 8, -54 -6 Z"
fill="#111111"
stroke="#111111"
stroke-width="2.5"
stroke-linejoin="round"
/>
<!-- Upper & Lower Cheek Whiskers -->
<g class="cat-whiskers">
<!-- Upper cheek whiskers -->
<path d="M -22 -42 Q -30 -60 -24 -72" stroke="#111111" stroke-width="2.2" stroke-linecap="round" />
<path d="M -12 -45 Q -16 -64 -8 -75" stroke="#111111" stroke-width="2.2" stroke-linecap="round" />
<path d="M -20 -34 L -24 -46" stroke="#ffffff" stroke-width="1.9" stroke-linecap="round" class="cat-inner-detail" />
<path d="M -11 -36 L -13 -48" stroke="#ffffff" stroke-width="1.9" stroke-linecap="round" class="cat-inner-detail" />
<!-- Lower cheek whiskers (white against dark fur) -->
<path d="M 10 34 Q 20 48 28 56" stroke="#ffffff" stroke-width="2.1" stroke-linecap="round" class="cat-inner-detail" />
<path d="M 20 30 Q 32 44 42 50" stroke="#ffffff" stroke-width="2.1" stroke-linecap="round" class="cat-inner-detail" />
<path d="M 28 24 Q 42 36 52 42" stroke="#ffffff" stroke-width="2.1" stroke-linecap="round" class="cat-inner-detail" />
</g>
<!-- Eyes Group (scales for blinking) -->
<g id="floor-eyes-blink">
<!-- Upper Eye -->
<g transform="translate(-8, -18)">
<circle cx="0" cy="0" r="14.5" fill="#ffffff" stroke="#111111" stroke-width="2.5" />
<circle id="floor-pupil-u" cx="-2.5" cy="-2" r="9.5" fill="#111111" />
</g>
<!-- Lower Eye -->
<g transform="translate(18, 14)">
<circle cx="0" cy="0" r="14.5" fill="#ffffff" stroke="#111111" stroke-width="2.5" />
<circle id="floor-pupil-l" cx="-2.5" cy="-2" r="9.5" fill="#111111" />
</g>
</g>
<!-- Sideways Cute Nose & '3' Mouth -->
<g transform="translate(-12, 8) rotate(52)">
<polygon class="cat-nose-fill" points="-4,-3 4,-3 0,2" fill="#ffffff" />
<path
class="cat-inner-detail"
d="M -7 3.5 Q -3.5 8.5 0 3 Q 3.5 8.5 7 3.5"
stroke="#ffffff"
stroke-width="2.3"
stroke-linecap="round"
fill="none"
/>
</g>
</g>
<!-- Lower Front Paw (tucked near yarn string) -->
<g id="floor-paw-lower" transform="translate(314, 646)">
<path
class="cat-body-fill"
d="M -18 -8 C -6 -14, 14 -12, 18 0 C 20 10, 4 16, -14 12 Z"
fill="#111111"
stroke="#ffffff"
stroke-width="2"
/>
</g>
<!-- Playful Swiping Front Arm & Paw (Reaches over the Yarn Ball!) -->
<g id="floor-paw-swipe" transform="translate(312, 608)">
<!-- White outer contour so the black arm stands out cleanly against the black torso -->
<path
class="cat-body-fill"
d="M 10 10
C 4 -12, -14 -26, -34 -24
C -50 -22, -58 -8, -50 6
C -42 18, -22 14, -6 20"
fill="#111111"
stroke="#ffffff"
stroke-width="2.5"
stroke-linecap="round"
stroke-linejoin="round"
/>
<!-- Cute white claw/toe lines on the swiping paw -->
<path class="cat-inner-detail" d="M -46 -12 C -40 -10, -36 -8, -34 -6" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
<path class="cat-inner-detail" d="M -49 -4 C -42 -3, -38 -1, -35 0" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
<path class="cat-inner-detail" d="M -47 4 C -41 4, -37 5, -34 6" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
</g>
<!-- Hitbox for Floor Cat -->
<rect id="floor-cat-hitbox" class="cat-hitbox" x="85" y="515" width="355" height="160" rx="30" />
</g>
<!-- -----------------------------------------------------------------------
3B. INTERACTIVE BALL OF YARN & TRAILING STRING
----------------------------------------------------------------------- -->
<g id="yarn-system">
<!-- Left short loose yarn strand -->
<path
id="yarn-string-left"
d="M 214 662 C 196 668, 192 684, 162 683"
stroke="#111111"
stroke-width="2.6"
stroke-linecap="round"
fill="none"
/>
<!-- Right long wavy yarn string (ripples dynamically when yarn moves) -->
<path
id="yarn-string-right"
d="M 262 660 C 292 642, 326 654, 360 680 C 392 704, 436 676, 462 692 C 474 698, 464 710, 452 704"
stroke="#111111"
stroke-width="2.6"
stroke-linecap="round"
fill="none"
/>
<!-- Rolling Yarn Ball Group (translates X and rotates) -->
<g id="yarn-ball-group" transform="translate(242, 642)">
<g id="yarn-ball-rotator">
<!-- Base white circle -->
<circle cx="0" cy="0" r="35" fill="#ffffff" stroke="#111111" stroke-width="3.2" />
<!-- Hand-drawn intersecting yarn wraps clipped to ball -->
<g clip-path="url(#yarn-clip)" stroke="#111111" stroke-width="2.1" stroke-linecap="round" fill="none">
<!-- Band 1 (Upper-left to center) -->
<path d="M -38 -14 C -16 -24, 8 -14, 22 4" />
<path d="M -36 -6 C -14 -16, 10 -6, 20 12" />
<path d="M -34 2 C -12 -8, 12 2, 16 20" />
<!-- Band 2 (Top-right diagonal wraps) -->
<path d="M -6 -38 C 8 -18, 12 8, -4 36" />
<path d="M 4 -38 C 18 -18, 22 8, 6 36" />
<path d="M 14 -34 C 28 -14, 30 10, 16 36" />
<!-- Band 3 (Bottom-left cross wraps) -->
<path d="M -32 14 C -14 6, 8 14, 28 30" />
<path d="M -26 22 C -10 14, 10 22, 24 36" />
<path d="M -18 30 C -4 24, 10 28, 18 38" />
<!-- Band 4 (Upper-right accents) -->
<path d="M 8 -22 C 20 -24, 32 -18, 38 -8" />
<path d="M 14 -14 C 24 -16, 34 -10, 38 0" />
<!-- Little stitch texture dashes -->
<line x1="-18" y1="-22" x2="-13" y2="-25" />
<line x1="-24" y1="6" x2="-19" y2="3" />
<line x1="22" y1="12" x2="26" y2="8" />
</g>
<!-- Re-stroke outer ring for crispness -->
<circle cx="0" cy="0" r="35" fill="none" stroke="#111111" stroke-width="3.2" />
</g>
<!-- Hitbox specifically for Yarn Ball -->
<circle id="yarn-hitbox" class="cat-hitbox" cx="0" cy="0" r="42" />
</g>
</g>
</g>
<g id="side-annotation" transform="translate(8, 292) rotate(-13) scale(0.8)">
<text x="0" y="0" class="hand-note-side">SAME</text>
<text x="0" y="22" class="hand-note-side">CURIOSITY.</text>
<text x="0" y="44" class="hand-note-side">BIGGER</text>
<text x="0" y="66" class="hand-note-side">IDEAS.</text>
</g>
</svg>`;
