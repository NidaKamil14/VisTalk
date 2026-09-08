/**
 * VisTalk Curriculum Data Architecture
 * 
 * Provides clean curriculum models for Alphabets, Numbers, Everyday Words,
 * and Common Phrases. Structured so verified datasets (e.g. WLASL, ASL Lexicon,
 * or custom recorded video/landmarks) can be cleanly plugged in during Task 2.
 */

export const CATEGORIES = [
  {
    id: "alphabets",
    number: "01",
    title: "Alphabets",
    shortTitle: "Alphabets",
    description: "Master the manual signs for A to Z and build your fingerspelling foundation.",
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
    description: "Learn numbers 1 to 10 and foundational manual counting signs.",
    level: "Beginner",
    path: "/learn/numbers",
    itemCount: 10,
    icon: "🔢",
  },
  {
    id: "words",
    number: "03",
    title: "Everyday Words",
    shortTitle: "Words",
    description: "Essential high-frequency signs for daily greetings and practical interactions.",
    level: "Beginner",
    path: "/learn/words",
    itemCount: 8,
    icon: "💬",
  },
  {
    id: "phrases",
    number: "04",
    title: "Common Phrases",
    shortTitle: "Phrases",
    description: "Connect signs together into natural expressions and conversational sentences.",
    level: "Intermediate",
    path: "/learn/phrases",
    itemCount: 6,
    icon: "🤝",
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

// Alphabet letters A through Z
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
    datasetStatus: "Verified ISL Dataset Reference Image (Hemg Dataset)",
  };
});

// Numbers 1 through 10
export const NUMBERS_DATA = [
  {
    id: "1",
    title: "Number 1",
    symbol: "1",
    category: "numbers",
    level: "Beginner",
    tag: "NUMBERS • BEGINNER",
    summary: "Single digit counting sign for one.",
    postureGuidance: "Standard numerical sign for '1'. In manual counting, the index finger is extended with the remaining fingers closed.",
    practiceTip: "Hold hand steady and upright without wavering.",
    commonMistakes: "Extending the thumb instead of the index finger.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "2",
    title: "Number 2",
    symbol: "2",
    category: "numbers",
    level: "Beginner",
    tag: "NUMBERS • BEGINNER",
    summary: "Single digit counting sign for two.",
    postureGuidance: "Index and middle fingers extended in a V-shape with palm facing inward or forward depending on dialect.",
    practiceTip: "Keep both fingers straight and separated evenly.",
    commonMistakes: "Letting the ring finger slip open.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "3",
    title: "Number 3",
    symbol: "3",
    category: "numbers",
    level: "Beginner",
    tag: "NUMBERS • BEGINNER",
    summary: "Single digit counting sign for three.",
    postureGuidance: "Thumb, index, and middle fingers extended with ring and pinky fingers folded down.",
    practiceTip: "Note that in ASL number 3 uses the thumb rather than the ring finger.",
    commonMistakes: "Using European counting style (index, middle, ring).",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "4",
    title: "Number 4",
    symbol: "4",
    category: "numbers",
    level: "Beginner",
    tag: "NUMBERS • BEGINNER",
    summary: "Single digit counting sign for four.",
    postureGuidance: "Four fingers extended upright with thumb folded neatly across the palm.",
    practiceTip: "Ensure the four fingers are spread comfortably.",
    commonMistakes: "Leaving the thumb sticking out sideways.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "5",
    title: "Number 5",
    symbol: "5",
    category: "numbers",
    level: "Beginner",
    tag: "NUMBERS • BEGINNER",
    summary: "Single digit counting sign for five.",
    postureGuidance: "All five digits fully extended and gently spread, palm facing forward.",
    practiceTip: "Present an open, calm hand without locking the finger joints.",
    commonMistakes: "Overextending backwards at the knuckles.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "6",
    title: "Number 6",
    symbol: "6",
    category: "numbers",
    level: "Beginner",
    tag: "NUMBERS • BEGINNER",
    summary: "Single digit counting sign for six.",
    postureGuidance: "Thumb and pinky tip touching lightly, while index, middle, and ring fingers remain upright.",
    practiceTip: "Form a clean contact between pinky and thumb pad.",
    commonMistakes: "Confusing with number 9 (index-thumb contact).",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "7",
    title: "Number 7",
    symbol: "7",
    category: "numbers",
    level: "Beginner",
    tag: "NUMBERS • BEGINNER",
    summary: "Single digit counting sign for seven.",
    postureGuidance: "Thumb touches the tip of the ring finger while index, middle, and pinky stay extended.",
    practiceTip: "Practice independent ring-finger control.",
    commonMistakes: "Collapsing the middle finger alongside the ring finger.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "8",
    title: "Number 8",
    symbol: "8",
    category: "numbers",
    level: "Beginner",
    tag: "NUMBERS • BEGINNER",
    summary: "Single digit counting sign for eight.",
    postureGuidance: "Thumb touches the tip of the middle finger while index, ring, and pinky fingers are upright.",
    practiceTip: "Keep the index and ring fingers well-separated.",
    commonMistakes: "Touching the ring finger instead of middle finger.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "9",
    title: "Number 9",
    symbol: "9",
    category: "numbers",
    level: "Beginner",
    tag: "NUMBERS • BEGINNER",
    summary: "Single digit counting sign for nine.",
    postureGuidance: "Thumb touches the tip of the index finger while middle, ring, and pinky fingers remain extended.",
    practiceTip: "Similar to the 'OK' handshape with palm facing outward.",
    commonMistakes: "Confusing with the letter 'F' or number 6.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "10",
    title: "Number 10",
    symbol: "10",
    category: "numbers",
    level: "Beginner",
    tag: "NUMBERS • BEGINNER",
    summary: "Two-digit milestone sign for ten.",
    postureGuidance: "A fist with thumb pointing upward, shaken slightly side-to-side.",
    practiceTip: "A quick, subtle wrist pivot gives the sign clarity.",
    commonMistakes: "Exaggerating the shake or swinging the entire forearm.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
];

// Everyday Words
export const WORDS_DATA = [
  {
    id: "hello",
    title: "Hello",
    symbol: "Hello",
    category: "words",
    level: "Beginner",
    tag: "WORDS • BEGINNER",
    summary: "Friendly opening greeting sign.",
    postureGuidance: "Flat hand starts near the temple or brow and smoothly sweeps upward and outward, akin to an open salute.",
    practiceTip: "Pair with an approachable facial expression and eye contact.",
    commonMistakes: "Starting too far from the head or using an overly stiff salute.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "thank-you",
    title: "Thank You",
    symbol: "Thanks",
    category: "words",
    level: "Beginner",
    tag: "WORDS • BEGINNER",
    summary: "Essential expression of gratitude.",
    postureGuidance: "Fingertips of dominant flat hand touch chin/lips and gently move forward and downward toward the other person.",
    practiceTip: "Keep the movement smooth, extending respect outward.",
    commonMistakes: "Confusing with the sign for 'Blow a Kiss' or starting from the chest.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "please",
    title: "Please",
    symbol: "Please",
    category: "words",
    level: "Beginner",
    tag: "WORDS • BEGINNER",
    summary: "Polite request sign.",
    postureGuidance: "Flat hand placed flat over the center of the chest, rubbing in a gentle clockwise circular motion.",
    practiceTip: "A sincere expression reinforces the polite intent.",
    commonMistakes: "Rubbing counter-clockwise or using both hands.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "yes",
    title: "Yes",
    symbol: "Yes",
    category: "words",
    level: "Beginner",
    tag: "WORDS • BEGINNER",
    summary: "Affirmative agreement sign.",
    postureGuidance: "Form an 'S' fist and nod it gently forward at the wrist, mimicking a head nod.",
    practiceTip: "A slight head nod alongside the hand enhances clarity.",
    commonMistakes: "Shaking sideways or moving the entire arm instead of the wrist.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "no",
    title: "No",
    symbol: "No",
    category: "words",
    level: "Beginner",
    tag: "WORDS • BEGINNER",
    summary: "Direct negative response sign.",
    postureGuidance: "Index and middle fingers snap down briskly to tap the thumb pad.",
    practiceTip: "Keep the tap crisp and decisive.",
    commonMistakes: "Using all four fingers instead of just index and middle.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "help",
    title: "Help",
    symbol: "Help",
    category: "words",
    level: "Beginner",
    tag: "WORDS • BEGINNER",
    summary: "Vital assistance and support sign.",
    postureGuidance: "Dominant hand forms a thumbs-up fist placed on top of non-dominant flat open palm; both hands lift upward together.",
    practiceTip: "The direction of movement can indicate who is helping whom (directional verb).",
    commonMistakes: "Dropping the hands rather than lifting upward together.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "sorry",
    title: "Sorry",
    symbol: "Sorry",
    category: "words",
    level: "Beginner",
    tag: "WORDS • BEGINNER",
    summary: "Apology and empathy sign.",
    postureGuidance: "Dominant hand forms an 'A' fist and rubs in a circular motion against the chest over the heart.",
    practiceTip: "Facial expression should genuinely reflect remorse or empathy.",
    commonMistakes: "Confusing with 'Please' (which uses an open flat hand instead of a fist).",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "friend",
    title: "Friend",
    symbol: "Friend",
    category: "words",
    level: "Beginner",
    tag: "WORDS • BEGINNER",
    summary: "Sign expressing camaraderie and friendship.",
    postureGuidance: "Both index fingers hook together once, then flip and hook in reverse.",
    practiceTip: "The interlinking fingers symbolize a bond.",
    commonMistakes: "Hooking only once without the alternating clasp.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
];

// Common Phrases
export const PHRASES_DATA = [
  {
    id: "nice-to-meet-you",
    title: "Nice to Meet You",
    symbol: "Nice to Meet You",
    category: "phrases",
    level: "Intermediate",
    tag: "PHRASES • INTERMEDIATE",
    summary: "Warm introductory conversation phrase.",
    postureGuidance: "A graceful sequence connecting 'NICE' (flat hand sweeps across palm) + 'MEET' (both index fingers approach each other) + 'YOU' (index points to partner).",
    practiceTip: "Ensure smooth transitions between signs without rushing.",
    commonMistakes: "Blending the signs so fast that the distinct handshapes blur.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "how-are-you",
    title: "How Are You?",
    symbol: "How Are You?",
    category: "phrases",
    level: "Intermediate",
    tag: "PHRASES • INTERMEDIATE",
    summary: "Frequent daily conversational question.",
    postureGuidance: "Combines 'HOW' (curved hands roll outward) followed by pointing toward conversation partner ('YOU').",
    practiceTip: "Lower eyebrows slightly to indicate an open-ended WH-question.",
    commonMistakes: "Omitting the natural facial grammatical marker.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "my-name-is",
    title: "My Name Is...",
    symbol: "My Name...",
    category: "phrases",
    level: "Intermediate",
    tag: "PHRASES • INTERMEDIATE",
    summary: "Standard self-introduction sequence.",
    postureGuidance: "Flat hand on chest ('MY') followed by tapping double 'H' fingers together twice ('NAME'), followed by fingerspelling your name.",
    practiceTip: "Keep fingerspelling steady rather than trying to spell quickly.",
    commonMistakes: "Using a pointing finger instead of flat hand for 'MY' (which means 'I' or 'ME').",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "good-morning",
    title: "Good Morning",
    symbol: "Good Morning",
    category: "phrases",
    level: "Intermediate",
    tag: "PHRASES • INTERMEDIATE",
    summary: "Morning greeting expression.",
    postureGuidance: "Signs 'GOOD' (chin to hand) transitioning smoothly into 'MORNING' (sun rising over non-dominant arm).",
    practiceTip: "A steady rising movement on 'morning' represents daylight emerging.",
    commonMistakes: "Rushing past the chin contact on 'GOOD'.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "see-you-later",
    title: "See You Later",
    symbol: "See You Later",
    category: "phrases",
    level: "Intermediate",
    tag: "PHRASES • INTERMEDIATE",
    summary: "Casual parting and farewell expression.",
    postureGuidance: "'SEE' (V-hand near eye) + 'YOU' (point outward) + 'LATER' (L-hand drops forward like a clock hand).",
    practiceTip: "Can be signed in a friendly, relaxed rhythm.",
    commonMistakes: "Flipping the 'L' hand backwards instead of forward.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
  {
    id: "thank-you-very-much",
    title: "Thank You Very Much",
    symbol: "Thank You Very Much",
    category: "phrases",
    level: "Intermediate",
    tag: "PHRASES • INTERMEDIATE",
    summary: "Amplified expression of deep gratitude.",
    postureGuidance: "Two-handed 'THANK YOU' initiated with both hands from chin/lips sweeping forward simultaneously with a warm smile.",
    practiceTip: "Two-handed variation signifies heightened warmth and sincerity.",
    commonMistakes: "Signing with one hand when expressing amplified thanks.",
    datasetStatus: "Slot prepared for verified Task 2 dataset",
  },
];

// Helper maps
const CURRICULUM_MAP = {
  alphabets: ALPHABETS_DATA,
  numbers: NUMBERS_DATA,
  words: WORDS_DATA,
  phrases: PHRASES_DATA,
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
  return (
    ALPHABETS_DATA.length +
    NUMBERS_DATA.length +
    WORDS_DATA.length +
    PHRASES_DATA.length
  );
}
