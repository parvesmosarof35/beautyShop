'use server';

import { revalidateTag } from 'next/cache';

// ... existing code ...
export async function revalidateFeaturedProducts() {
  revalidateTag('featured-products', 'max');
}

export async function revalidateFaq() {
  revalidateTag('faq', 'max');
}

export async function revalidateBlog() {
  revalidateTag('blog', 'max');
}

export async function revalidatePrivacy() {
  revalidateTag('privacy', 'max');
}

export async function revalidateTerms() {
  revalidateTag('termsAndConditions', 'max');
}

export async function revalidateAbout() {
  revalidateTag('aboutUs', 'max');
}

export async function revalidateProducts() {
  revalidateTag('product', 'max');
}
