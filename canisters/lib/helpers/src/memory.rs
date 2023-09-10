use ic_stable_structures::Memory as MemoryTrait;
const WASM_PAGE_SIZE: u64 = 65536;

/// Write memory and increase memory size if necessary.
/// use page size 64kb
pub fn write<M: MemoryTrait>(memory: &M, offset: u64, bytes: &[u8]) {
    let last_byte = offset
        .checked_add(bytes.len() as u64)
        .expect("Address space overflow");

    let size_pages = memory.size();
    let size_bytes = size_pages
        .checked_mul(WASM_PAGE_SIZE)
        .expect("Address space overflow");

    if size_bytes < last_byte {
        let diff_bytes = last_byte - size_bytes;
        let diff_pages = diff_bytes
            .checked_add(WASM_PAGE_SIZE - 1)
            .expect("Address space overflow")
            / WASM_PAGE_SIZE;
        if memory.grow(diff_pages) == -1 {
            panic!(
                "Failed to grow memory from {} pages to {} pages (delta = {} pages).",
                size_pages,
                size_pages + diff_pages,
                diff_pages
            );
        }
    }
    memory.write(offset, bytes);
}
