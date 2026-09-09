/**
 * VisTalk Curriculum Data Architecture
 * 
 * Final MVP Curriculum Scope:
 * 1. Alphabets → A–Z (26 classes)
 * 2. Numbers   → 0–9 (10 classes)
 * 3. Coming Soon → Future module showcase
 */

export const CATEGORIES = [
  {
    id: "alphabets",
    number: "01",
    title: "Alphabets",
    shortTitle: "Alphabets",
    description: "Master the manual signs for A to Z and build your ISL fingerspelling foundation.",
    level: "Beginner",
    path: "/learn/alphabets",
    itemCount: 26,
    icon: "🔤",
  },
  {
    id: "numbers",
    number: "02",
    title: "Numbers",
    shortTitle: "Numbers",
    description: "Learn numbers 0 to 9 and foundational ISL manual counting signs.",
    level: "Beginner",
    path: "/learn/numbers",
    itemCount: 10,
    icon: "🔢",
  },
  {
    id: "coming_soon",
    number: "03",
    title: "Coming Soon",
    shortTitle: "Future Modules",
    description: "Everyday Words, Conversational Phrases, and Dialogue Practice coming in future releases.",
    level: "Future",
    path: "/learn/coming_soon",
    itemCount: 0,
    icon: "✨",
  },
];

// Authentic Indian Sign Language (ISL) Alphabet Descriptions & References
const ISL_ALPHABET_GUIDANCE = {
  A: {
    guidance: "Form thumbs-up with both hands and touch the tips of both thumbs together in front of your chest.",
    tip: "Keep both thumbs upright and knuckles facing inward.",
    mistake: "Do not fold thumbs flat against the fingers."
  },
  B: {
    guidance: "Form circular loops with thumb and index fingers on both hands, bringing the two circles together horizontally.",
    tip: "Touch the index finger and thumb tips together firmly on both hands.",
    mistake: "Avoid closing other fingers into a tight fist."
  },
  C: {
    guidance: "Curve your dominant hand into an open 'C' shape with fingers together and thumb curved below.",
    tip: "Keep the palm facing sideways so the 'C' curvature is clear to the viewer.",
    mistake: "Do not close the fingers completely."
  },
  D: {
    guidance: "Hold your non-dominant index finger upright, and form a semi-circle with your dominant thumb and index touching it to shape a 'D'.",
    tip: "The dominant hand creates the curved loop while the other hand serves as the straight vertical stem.",
    mistake: "Do not separate the touching finger tips."
  },
  E: {
    guidance: "Extend your left index finger vertically, and touch its tip with your right index finger held horizontally.",
    tip: "Form a clean 'T' or corner intersection touching at the tips.",
    mistake: "Ensure fingers are straight, not curled."
  },
  F: {
    guidance: "Touch index and thumb tips together on both hands to form two interlocking circular loops.",
    tip: "Keep remaining three fingers relaxed and extended.",
    mistake: "Do not cross wrists."
  },
  G: {
    guidance: "Form two fists and place your dominant fist directly on top of the other fist.",
    tip: "Stack fists vertically aligned in front of your chest.",
    mistake: "Do not place fists side by side."
  },
  H: {
    guidance: "Hold your non-dominant palm flat and upright facing you, and place your dominant flat hand horizontally across it to form an 'H'.",
    tip: "Fingers of both hands should be straight and together.",
    mistake: "Avoid slanting the horizontal hand."
  },
  I: {
    guidance: "Extend your dominant index finger straight upright while keeping other fingers and thumb closed.",
    tip: "Hold the index finger steady and upright at chest level.",
    mistake: "Do not extend the pinky (that is ASL 'I', not ISL 'I')."
  },
  J: {
    guidance: "Extend your index finger and trace a gentle curve in the air from top to bottom.",
    tip: "Keep the motion fluid and centered in the camera frame.",
    mistake: "Do not move the whole arm, just the hand."
  },
  K: {
    guidance: "Extend your left index finger vertically and touch the knuckle with your right index finger bent at an angle.",
    tip: "The dominant hand forms the angled branches of the 'K'.",
    mistake: "Do not overlap palms completely."
  },
  L: {
    guidance: "Form an 'L' shape with your dominant hand by extending thumb and index finger at a 90-degree angle.",
    tip: "Keep the palm facing outward toward the camera mirror.",
    mistake: "Ensure the angle between thumb and index is a crisp right angle."
  },
  M: {
    guidance: "Hold your left hand flat horizontally with palm down, and place three fingers (index, middle, ring) of your right hand underneath it.",
    tip: "Three fingers represent the three legs of the letter 'M'.",
    mistake: "Do not use two fingers (that represents 'N')."
  },
  N: {
    guidance: "Hold your left hand flat horizontally with palm down, and place two fingers (index and middle) of your right hand underneath it.",
    tip: "Two fingers represent the two legs of the letter 'N'.",
    mistake: "Do not use three fingers (that represents 'M')."
  },
  O: {
    guidance: "Touch the tips of your thumb and fingers together to form a circular 'O' shape.",
    tip: "Keep the circle round and open so light shows through the center.",
    mistake: "Avoid flattening the fingers into a pancake shape."
  },
  P: {
    guidance: "Hold your left index finger upright, and form a loop with your right thumb and curved index touching the top of the left index finger.",
    tip: "The right hand loop forms the upper lobe of the letter 'P'.",
    mistake: "Do not place the loop at the bottom (which would resemble 'B' or 'D')."
  },
  Q: {
    guidance: "Form a circular loop with your right thumb and index, and pass your left index finger through the loop diagonally.",
    tip: "The left index finger forms the tail of the 'Q'.",
    mistake: "Keep the loop clearly visible from the front."
  },
  R: {
    guidance: "Hold your left hand open with palm facing you, and touch the center of the palm with your right index finger.",
    tip: "Keep the left palm flat and steady as the target surface.",
    mistake: "Do not cover the whole palm with a fist."
  },
  S: {
    guidance: "Hold your left index finger upright, and hook your right index finger over the top of it in a clasping posture.",
    tip: "Interlock the fingertips neatly at eye/chest level.",
    mistake: "Do not make a fist."
  },
  T: {
    guidance: "Hold your left hand flat vertically, and touch your right index finger perpendicular to the lower edge forming a 'T'.",
    tip: "The right index finger acts as the horizontal or perpendicular bar of the 'T'.",
    mistake: "Do not bend the fingers."
  },
  U: {
    guidance: "Extend index and middle fingers on both hands and touch their fingertips together facing upwards in a 'U' arch.",
    tip: "Form an open cup/arch shape with both pairs of fingers.",
    mistake: "Do not cross the fingers."
  },
  V: {
    guidance: "Extend your index and middle fingers in an upright 'V' shape (peace sign) with palm facing forward.",
    tip: "Spread the index and middle fingers apart evenly in a crisp 'V'.",
    mistake: "Do not point fingers sideways."
  },
  W: {
    guidance: "Extend your index, middle, and ring fingers upright in a 'W' shape while thumb holds the pinky.",
    tip: "Spread all three fingers evenly with palm facing forward.",
    mistake: "Avoid curling the ring finger down."
  },
  X: {
    guidance: "Cross both index fingers over each other to form an 'X' shape in front of your chest.",
    tip: "Position both index fingers at 45-degree angles crossing at the center.",
    mistake: "Do not cross entire hands, cross only the index fingers."
  },
  Y: {
    guidance: "Extend your thumb and pinky finger outward while keeping the middle three fingers folded into the palm.",
    tip: "Palm should face forward with thumb and pinky spread wide.",
    mistake: "Do not extend the index finger."
  },
  Z: {
    guidance: "Place your left palm flat facing up, and touch your right fingertips to the left palm forming the 'Z' angle.",
    tip: "Keep the lower palm horizontal and touch down firmly.",
    mistake: "Do not close the lower hand."
  }
};

// Alphabet letters A through Z (26 classes)
export const ALPHABETS_DATA = Array.from({ length: 26 }, (_, index) => {
  const letter = String.fromCharCode(65 + index);
  const info = ISL_ALPHABET_GUIDANCE[letter] || {};
  return {
    id: letter,
    title: `Letter ${letter}`,
    symbol: letter,
    category: "alphabets",
    level: "Beginner",
    tag: "ISL ALPHABET • A–Z",
    summary: `Authentic Indian Sign Language (ISL) manual alphabet sign for '${letter}'.`,
    postureGuidance: info.guidance || `Standard Indian Sign Language (ISL) manual posture for '${letter}'.`,
    practiceTip: info.tip || "Keep your hands relaxed and positioned clearly within the camera frame.",
    commonMistakes: info.mistake || "Ensure fingers are positioned distinctly according to the reference photo.",
    mediaUrl: `/reference_signs/${letter}.jpg`,
    datasetStatus: "Verified ISL Alphabet Reference Image",
  };
});

// Authentic Indian Sign Language (ISL) Numbers 0 through 9 (10 classes)
const ISL_NUMBER_GUIDANCE = {
  "0": {
    guidance: "Form a circular 'O' shape by touching the thumb and all fingertips together in front of your chest.",
    tip: "Keep the circle neat and visible directly to the camera.",
    mistake: "Do not close into a tight fist."
  },
  "1": {
    guidance: "Extend your index finger straight upright while keeping other fingers and thumb closed.",
    tip: "Hold your hand steady at chest level with palm facing forward.",
    mistake: "Do not extend the thumb."
  },
  "2": {
    guidance: "Extend index and middle fingers in an upright 'V' shape while thumb holds folded ring and pinky fingers.",
    tip: "Keep index and middle fingers straight and evenly separated.",
    mistake: "Do not curl the index finger."
  },
  "3": {
    guidance: "Extend thumb, index, and middle fingers outward while keeping ring and pinky folded.",
    tip: "Spread the three active fingers evenly.",
    mistake: "Avoid folding the thumb flat."
  },
  "4": {
    guidance: "Extend all four fingers (index, middle, ring, pinky) upright and spread evenly, with thumb folded across palm.",
    tip: "Keep all four fingers vertical and upright.",
    mistake: "Do not leave the thumb sticking out sideways."
  },
  "5": {
    guidance: "Extend all five fingers and thumb fully open with palm facing outward toward the camera.",
    tip: "Present an open, relaxed hand without tensing knuckles.",
    mistake: "Do not bend finger joints backward."
  },
  "6": {
    guidance: "Touch your thumb tip to your pinky fingertip while keeping index, middle, and ring fingers upright.",
    tip: "Make clean contact between thumb and pinky tips.",
    mistake: "Do not confuse with number 9 (which uses the index finger)."
  },
  "7": {
    guidance: "Touch your thumb tip to your ring fingertip while keeping index, middle, and pinky fingers extended.",
    tip: "Keep the remaining three fingers steady and upright.",
    mistake: "Do not collapse the middle finger alongside the ring finger."
  },
  "8": {
    guidance: "Touch your thumb tip to your middle fingertip while keeping index, ring, and pinky fingers upright.",
    tip: "Maintain a distinct gap between index and ring fingers.",
    mistake: "Do not touch the ring finger instead of middle finger."
  },
  "9": {
    guidance: "Touch your thumb tip to your index fingertip to form a circular loop while middle, ring, and pinky fingers remain extended.",
    tip: "Resembles the 'OK' handshape with palm facing forward.",
    mistake: "Do not confuse with number 6 (pinky contact)."
  }
};

// Numbers 0 through 9
export const NUMBERS_DATA = Array.from({ length: 10 }, (_, index) => {
  const digit = String(index);
  const info = ISL_NUMBER_GUIDANCE[digit] || {};
  return {
    id: digit,
    title: `Number ${digit}`,
    symbol: digit,
    category: "numbers",
    level: "Beginner",
    tag: "ISL NUMBERS • 0–9",
    summary: `Authentic Indian Sign Language (ISL) manual counting sign for '${digit}'.`,
    postureGuidance: info.guidance || `Standard Indian Sign Language (ISL) manual posture for '${digit}'.`,
    practiceTip: info.tip || "Keep your hand steady and centered in the frame.",
    commonMistakes: info.mistake || "Ensure fingers are positioned distinctly according to the reference photo.",
    mediaUrl: `/reference_signs/numbers/${digit}.jpg`,
    datasetStatus: "Verified ISL Numbers Reference Image",
  };
});

// Helper curriculum map
const CURRICULUM_MAP = {
  alphabets: ALPHABETS_DATA,
  numbers: NUMBERS_DATA,
  coming_soon: [],
};

export function getCategories() {
  return CATEGORIES;
}

export function getCategoryConfig(categoryId) {
  return CATEGORIES.find((cat) => cat.id === categoryId) || null;
}

export function getItemsByCategory(categoryId) {
  return CURRICULUM_MAP[categoryId] || [];
}

export function getItem(categoryId, itemId) {
  const items = getItemsByCategory(categoryId);
  if (!items.length) return null;
  const targetId = String(itemId).toLowerCase();
  return items.find((item) => String(item.id).toLowerCase() === targetId) || null;
}

export function getAdjacentItems(categoryId, itemId) {
  const items = getItemsByCategory(categoryId);
  const targetId = String(itemId).toLowerCase();
  const currentIndex = items.findIndex(
    (item) => String(item.id).toLowerCase() === targetId
  );

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: currentIndex > 0 ? items[currentIndex - 1] : null,
    next: currentIndex < items.length - 1 ? items[currentIndex + 1] : null,
    index: currentIndex,
    total: items.length,
  };
}

export function getTotalCount() {
  return ALPHABETS_DATA.length + NUMBERS_DATA.length;
}
