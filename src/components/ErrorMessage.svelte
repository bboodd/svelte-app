<script>
    export let error  // 전달받은 오류
</script>

{#if typeof error.message === 'string'}
    <div class="alert alert-danger" role="alert">
        <div>
            {error.message}
        </div>
    </div>
{/if}