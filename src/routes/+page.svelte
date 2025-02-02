<script>
	let props = $props();
	let questionList = props.data.questionList;

</script>

<div class="container my-3">
	<table class="table">
		<thead>
			<tr class="table-dark">
				<th>번호</th>
				<th>제목</th>
				<th>작성일시</th>
			</tr>
		</thead>
		<tbody>
			{#each questionList as question, i}
				<tr>
					<td>{i+1}</td>
					<td>
						<a href="/detail/{question._id}">{question.subject}</a>
					</td>
					<td>{question.createdAt}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<a href="/create" class="btn btn-primary">질문 등록하기</a>
</div>