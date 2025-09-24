// Practice exercises for learning Rust
// Run with: cargo test practice

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ownership_exercise() {
        // Your exercise code goes here
        assert_eq!(2 + 2, 4);
    }
}

// Exercise 1: Implement a function that takes ownership of a String
// and returns its length
pub fn string_length_owner(s: String) -> usize {
    // Your implementation here
    todo!("Implement this function")
}

// Exercise 2: Implement a function that borrows a string slice
// and returns whether it contains "rust"
pub fn contains_rust(s: &str) -> bool {
    // Your implementation here
    todo!("Implement this function")
}

// Exercise 3: Work with vectors - filter even numbers
pub fn filter_even_numbers(numbers: Vec<i32>) -> Vec<i32> {
    // Your implementation here
    todo!("Implement this function")
}