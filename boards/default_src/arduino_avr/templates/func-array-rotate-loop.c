void array_rotate_loop(void *arr, size_t elem_size, size_t length, bool right) {
  if (length <= 1) {
    return;
  }

  uint8_t buffer[32];
  if (elem_size > sizeof(buffer)) {
    return;
  }

  if (right) {
    memcpy(buffer, (uint8_t *)arr + (length - 1) * elem_size, elem_size);
    memmove((uint8_t *)arr + elem_size, arr, (length - 1) * elem_size);
    memcpy(arr, buffer, elem_size);
  } else {
    memcpy(buffer, arr, elem_size);
    memmove(arr, (uint8_t *)arr + elem_size, (length - 1) * elem_size);
    memcpy((uint8_t *)arr + (length - 1) * elem_size, buffer, elem_size);
  }
}